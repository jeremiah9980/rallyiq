# NextGen Rally — Complete Deployment Manual

> Covers all four deliverables of the consolidated platform:
> **NextGen Rally Team Site**, **NextGen Rally-OS**, **NextGen Rally-ORG**, and **NextGen Rally-IQ**.
> Companion docs: [`deployment-blueprint.md`](./deployment-blueprint.md) (architecture) and
> [`copilot-master-prompt.md`](./copilot-master-prompt.md) (scaffold prompts).

This manual takes you from a clean machine to a fully deployed, multi-team production system. It assumes the `jeremiah9980/Next-Gen-Rally-OS` monorepo has been scaffolded from Prompt 0.

---

## 0. What each component is (read first)

The four names are **one monorepo, four deployable surfaces**. Do not deploy them as four separate codebases — they share `packages/*` and one database.

| Component | Repo/app path | What it is | Runtime | Who uses it |
|---|---|---|---|---|
| **Rally-OS** | `apps/rally-os` | The operations app and **system of record** — teams, rosters, profiles, schedules, integrations. Everything else reads from its database. | Always-on Next.js server + Postgres | Coaches (authenticated) |
| **Rally-IQ** | `packages/ai` surfaced inside `apps/rally-os` | The **intelligence layer**: AI practice-plan builder, player-trend suggestions. Not a separate deploy — it's a capability of Rally-OS that needs its own API key + env. | Runs inside Rally-OS (server actions / route handlers) | Coaches |
| **Rally-ORG** | `apps/org-builder` | The **deployment tool** itself — config-driven generator that provisions a team, composes site modules, and publishes a Team Site. This is "the complete deployment tool." | On-demand (CLI + UI wizard), can be a route in Rally-OS | Org admins / coaches |
| **Team Site** | `apps/public-site` (from `packages/site-template`) | The **public-facing team website** Rally-ORG generates — one per team/season. Renders only the published projection, never operational data. | Static/ISR Next.js, one deployment per team domain | Public / recruits / parents |

**Deployment order is fixed by dependency:** shared packages build first → **Rally-OS + database** (the record) → **Rally-IQ** config (keys on Rally-OS) → **Rally-ORG** (needs Rally-OS's DB to provision) → **Team Sites** (generated last, by Rally-ORG).

```
packages/* ──▶ Rally-OS (+DB) ──▶ Rally-IQ keys ──▶ Rally-ORG ──▶ Team Site(s)
```

---

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 20 LTS | `nvm install 20 && nvm use 20` |
| pnpm | ≥ 9 | `corepack enable && corepack prepare pnpm@latest --activate` |
| PostgreSQL | ≥ 15 | Neon / Railway / Supabase for managed; local Docker for dev |
| Git | any | |
| Vercel CLI | latest | `npm i -g vercel` (for the recommended deploy path) |
| Anthropic API key | — | for Rally-IQ; from console.anthropic.com |

Accounts you'll need: **Vercel** (app + site hosting), a **Postgres provider**, **Anthropic** (Rally-IQ), an **SMTP provider** (magic-link auth — e.g. Resend/Postmark/SES), and a **DNS provider** for team-site domains.

---

## 2. The environment contract

One `.env` at the monorepo root drives every app (Turborepo passes it through). Copy `infra/.env.example` → `.env` and fill in:

```bash
# --- Database (Rally-OS system of record) ---
DATABASE_URL="postgresql://user:pass@host:5432/rally_os"

# --- Auth (Rally-OS) ---
NEXTAUTH_URL="https://ops.rally.app"        # MUST be set & non-empty or the build crashes
NEXTAUTH_SECRET="<openssl rand -base64 32>"
EMAIL_SERVER="smtp://user:pass@smtp.provider.com:587"   # magic-link transport
EMAIL_FROM="no-reply@rally.app"

# --- Rally-IQ (AI layer) ---
ANTHROPIC_API_KEY="sk-ant-..."
RALLY_IQ_MODEL="claude-sonnet-4-6"           # or claude-opus-4-8 for higher quality plans

# --- NCS worker ---
NCS_POLL_CRON="0 */6 * * *"                  # every 6h; roster/tournament monitoring

# --- Rally-ORG (publishing / deploy) ---
VERCEL_TOKEN="<vercel personal token>"       # so org-builder can deploy team sites
VERCEL_TEAM_ID="team_..."                    # optional, if deploying under a Vercel team
PUBLIC_SITE_BASE_DOMAIN="rally.app"          # team sites become <slug>.rally.app by default
```

> **The #1 deployment failure in this stack is an empty `NEXTAUTH_URL`.** `next-auth` calls `new URL(NEXTAUTH_URL)`; an empty string throws `Invalid URL` and the build dies on the login route. Always set it — even in CI, fall back to `http://localhost:3000`.

Never commit `.env`. Confirm it's git-ignored before your first commit.

---

## 3. Deploy Rally-OS (the system of record)

Rally-OS must exist and be migrated before anything else — Rally-ORG provisions teams *into its database*.

### 3.1 Local / staging bring-up

```bash
pnpm install                         # installs all workspaces
pnpm --filter @rally/core-data db:generate     # prisma generate
pnpm --filter @rally/core-data db:migrate      # apply migrations (prisma migrate deploy)
pnpm --filter @rally/core-data db:seed         # demo org, coach, team, drills
pnpm --filter rally-os dev                      # http://localhost:3000
```

Log in with the seeded coach account (printed by the seed script). Confirm the Team Portal shell loads with all nav sections.

### 3.2 Production (Vercel)

1. **Provision Postgres** first, get its `DATABASE_URL`.
2. **Run migrations against prod** from your machine (one-time + on each schema change):
   ```bash
   DATABASE_URL="<prod url>" pnpm --filter @rally/core-data db:migrate
   ```
3. **Create the Vercel project** pointed at `apps/rally-os`:
   ```bash
   cd apps/rally-os && vercel link
   vercel --prod
   ```
   Set **Root Directory** = `apps/rally-os`, **Build Command** = `cd ../.. && pnpm --filter rally-os build`, **Install Command** = `pnpm install` at repo root.
4. **Add all env vars** from §2 to the Vercel project (Production + Preview scopes). `NEXTAUTH_URL` = the deployed URL (e.g. `https://ops.rally.app`).
5. Redeploy so env vars take effect.

### 3.3 The NCS worker (companion to Rally-OS)

`services/ncs-worker` polls NCS and writes `NcsChangeReview` items. It is a **scheduled job**, not a web server. Two options:

- **Vercel Cron** → add to `apps/rally-os/vercel.json`:
  ```json
  { "crons": [{ "path": "/api/ncs/poll", "schedule": "0 */6 * * *" }] }
  ```
  (expose the worker as a protected route handler).
- **Railway/Render cron service** running `pnpm --filter ncs-worker start` on `NCS_POLL_CRON`.

It shares `DATABASE_URL` with Rally-OS. It never auto-applies changes — it only creates review items for the coach.

---

## 4. Enable Rally-IQ (the AI layer)

Rally-IQ is not a separate deployment — it's the practice-plan builder and player-trend engine living inside Rally-OS. To turn it on:

1. Ensure `ANTHROPIC_API_KEY` and `RALLY_IQ_MODEL` are set on the Rally-OS deployment (§2).
2. Verify the AI routes respond:
   ```bash
   curl -X POST https://ops.rally.app/api/ai/practice-plan \
     -H 'content-type: application/json' \
     -d '{"teamSeasonId":"<id>","practiceDate":"2026-07-10","durationMinutes":90,"teamFocus":"infield"}'
   ```
   Expect a JSON `PracticePlan` with **two** versions (coach + player).
3. **Cost/rate controls:** put the AI routes behind auth (coach-only), and set a per-org monthly token budget if you expose plan generation broadly. Opus produces richer plans at higher cost; Sonnet is the sensible default (`RALLY_IQ_MODEL=claude-sonnet-4-6`).
4. **Governance check:** confirm the generated **player version excludes `coach_notes`/private fields**. This is a hard requirement — a leak here exposes private coaching notes publicly once a site is published.

---

## 5. Deploy Rally-ORG (the deployment tool)

Rally-ORG is what turns a concept into a live team + site. It can run as a CLI and as a wizard route inside Rally-OS. It needs `DATABASE_URL` (to provision) and `VERCEL_TOKEN` (to publish sites).

### 5.1 The concept → operations pipeline

```
1. CONCEPT     author a site config (org, team, season, modules, integrations)
2. VALIDATE    rally-org validates it against the zod SiteConfig schema
3. PROVISION   creates Team + TeamSeason in Rally-OS DB, seeds Standards/Team Info
4. INTEGRATE   coach connects NCS (import roster) + GameChanger (map players) in Rally-OS
5. OPERATE     coach runs Rally-OS: monitoring, tournament approval, profiles, AI plans
6. PUBLISH     rally-org builds the Team Site from the published projection and deploys
7. ITERATE     ncs-worker keeps data live; re-publish on approved changes
```

### 5.2 Author a team config

```yaml
# configs/texas-venom-12u.yaml
organization: { name: Texas Venom, slug: texas-venom }
team:         { name: Texas Venom 12U, season: 2026, age_group: 12U }
modules:
  home: true
  team_info: true
  standards: true
  coach: true
  roster: true
  player_profiles: true
  schedule: true
  tournaments: true
  practice_plans: true      # player version only on the public site
  player_development: true
  gamechanger_stats: true
  social_media_hub: true
  fundraising: false
integrations: { ncs: true, gamechanger: true }
publish: { target: vercel, domain: texasvenom.rally.app }
```

### 5.3 Run the deploy tool

```bash
# provision the team into Rally-OS (steps 2–3)
pnpm --filter org-builder run provision configs/texas-venom-12u.yaml

# after the coach has operated Rally-OS, build + deploy the public site (step 6)
pnpm --filter org-builder run publish configs/texas-venom-12u.yaml
```

Or use the wizard: in Rally-OS, **Org → New Team Site**, which walks the same steps and calls the same `org-builder` functions.

### 5.4 Hosting Rally-ORG itself

If you expose the wizard as part of Rally-OS, there's no separate deploy — it ships with `apps/rally-os`. If you run it standalone (e.g. a CI job that regenerates sites nightly), deploy it as a small Vercel/Railway service or run the CLI from GitHub Actions with the same env contract.

---

## 6. Deploy a Team Site (public site)

Team Sites are generated by Rally-ORG (§5.3, `publish`). Each is an independent, static/ISR Next.js deployment reading a **published projection** of Rally-OS data.

### 6.1 What `publish` does

1. Reads the team's published projection from Rally-OS (only public-safe fields).
2. Composes the enabled `packages/site-template` modules per the config.
3. Builds `apps/public-site` with that team's data baked in (or fetched via ISR).
4. Deploys to Vercel under `publish.domain` using `VERCEL_TOKEN`.
5. Records the deployment URL back on the `TeamSeason` in Rally-OS.

### 6.2 Multi-tenant vs. per-team projects

- **Per-team Vercel project** (simplest mental model): one project + domain per team. Rally-ORG creates it on first publish.
- **Single multi-tenant app keyed by host** (scales better past ~dozens of teams): one `public-site` deployment, routing by `Host` header → team slug. Set `PUBLIC_SITE_BASE_DOMAIN` and add a wildcard domain `*.rally.app`.

Pick per-team to start; switch to multi-tenant when you outgrow it.

### 6.3 Domains

- Default: `<slug>.rally.app` (wildcard CNAME to Vercel).
- Custom (e.g. `texasvenom.com`): add the domain in Vercel, have the org point DNS (A/CNAME) as Vercel instructs, then set `publish.domain` to it and re-publish.

### 6.4 Re-publishing

When the coach approves an NCS roster change or a new game, re-run `publish` (or wire a Rally-OS "approved change" event to trigger `org-builder run publish`). ISR means you can also revalidate specific paths instead of a full rebuild.

---

## 7. CI/CD

Add `.github/workflows/ci.yml` (Prompt 0 generates a starting point):

```yaml
name: CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm build
        env:
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL || 'http://localhost:3000' }}
          NEXTAUTH_SECRET: ci-placeholder
          DATABASE_URL: postgresql://user:pass@localhost:5432/db
```

- Keep the `NEXTAUTH_URL` fallback — this is the exact fix that unblocked CI historically.
- Deploy on merge to `main`: a follow-up job running `vercel --prod` for `rally-os`, and (optionally) a matrix job that re-publishes changed team configs.
- If you use `npm` anywhere, install with `--legacy-peer-deps` (Next 16 peer-dep constraints); with pnpm this isn't needed.

---

## 8. Post-deploy verification checklist

Run top-to-bottom; each maps to the acceptance criteria in [`deployment-blueprint.md` §8](./deployment-blueprint.md#8-acceptance-checklist).

**Rally-OS**
- [ ] `/` and `/dashboard` load (no 404 — if 404, clear `.next` / check workspace root).
- [ ] Coach can log in (magic link email arrives → `EMAIL_SERVER` works).
- [ ] Team Portal shows all nav sections incl. Practice Planning.

**Rally-IQ**
- [ ] Practice-plan generation returns coach **and** player versions.
- [ ] Player version contains no private coach notes.
- [ ] `ANTHROPIC_API_KEY` valid (no 401 in logs).

**NCS + GameChanger**
- [ ] NCS roster import creates players attached to the season.
- [ ] `ncs-worker` cron fires and creates review items (not auto-applied).
- [ ] GameChanger connect stores `gcTeamId`; player mapping stores `gcPlayerId`.
- [ ] Tournament games appear as **drafts pending approval**; only approved games push; `gcGameId` stored.

**Rally-ORG + Team Site**
- [ ] `provision` creates the Team/TeamSeason in Rally-OS.
- [ ] `publish` deploys the site at `publish.domain`.
- [ ] Public site renders only public-safe data (no coach notes, no integration status).
- [ ] Re-publish reflects an approved change.

---

## 9. Rollback & recovery

| Situation | Action |
|---|---|
| Bad Rally-OS deploy | `vercel rollback` to the previous production deployment (data unaffected — DB is separate). |
| Bad migration | Restore DB from provider snapshot, then re-run the previous migration. Always snapshot before `db:migrate` in prod. |
| Bad Team Site publish | Re-run `publish` from last-good config, or `vercel rollback` that site's project. Team Sites are disposable — the record lives in Rally-OS. |
| Leaked private data on a public site | Immediately unpublish (remove the Vercel deployment/domain), fix the projection filter in `packages/site-template`, re-publish. |
| Runaway AI cost | Rotate/limit `ANTHROPIC_API_KEY`, gate AI routes behind a per-org budget flag. |

---

## 10. Environments summary

| Env | Rally-OS | Database | Team Sites | Purpose |
|---|---|---|---|---|
| **local** | `pnpm --filter rally-os dev` | local Postgres / Docker | `public-site dev` | development |
| **staging** | Vercel preview | staging Postgres | preview deployments | QA before prod |
| **production** | `ops.rally.app` | managed Postgres (+snapshots) | `*.rally.app` / custom domains | live |

Keep three separate `DATABASE_URL`s and three `NEXTAUTH_URL`s. Never point staging Rally-ORG at the production database — it provisions and mutates real team records.
