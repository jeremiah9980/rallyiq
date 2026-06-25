# Next-Gen-Rally-OS — Deployment Blueprint

> Target repo: **`jeremiah9980/Next-Gen-Rally-OS`**
> Consolidates: `rallyiq`, `ncs-monitor`, `NCS-DASH` (NCS dashboard), the `venom` team-site template, and the `rally-org-builder` publishing layer into a single monorepo that takes a team from **concept → team-site design → full coaching operations**.

This document is the architectural plan. The companion file [`copilot-master-prompt.md`](./copilot-master-prompt.md) is the paste-ready prompt for GitHub Copilot to scaffold it.

---

## 1. Why consolidate

Today the product is spread across five repos:

| Repo | Role today | Gap |
|---|---|---|
| `rallyiq` | Core coach app (system of record): teams, rosters, profiles, practice plans, GameChanger import | Standalone; no public publishing |
| `ncs-monitor` | NCS team search, roster + tournament monitoring | Separate service, not surfaced in one UI |
| `NCS-DASH` | NCS roster dashboard + tournament control center | Duplicates roster concepts that live in rallyiq |
| `venom` | Public team-site **template** (Home, Team Portal, Teams, Rosters, Player Profiles, Social Media Hub) | **Missing every Rally-IQ operational module** (GameChanger, Player Development, Coach, NCS dashboards, Integrations Hub, Fundraising) |
| `rally-org-builder` | Config-driven publishing of public team sites | Does not yet consume `venom` as its structured template source |

The Venom diagram shows the public-site surface (HOME → TEAM PORTAL → TEAMS → 10U/12U/14U ROSTERS → Player Profiles, plus Social Media Hub / Team Info / Standards). The Rally Platform Ecosystem diagram shows the *operations* surface (Rally-IQ core + NCS toolset + GameChanger enrichment). **Next-Gen-Rally-OS is the repo where those two halves finally live together.**

The seam between them is deliberate and one-directional:

```
NCS (intelligence) ──▶ Rally-IQ (system of record) ──▶ Rally-Org-Builder (publishing) ──▶ Public Team Site (venom template)
                                  ▲
                          GameChanger (read-only stat + clip enrichment)
```

Rally-IQ is always the system of record. NCS feeds it, GameChanger enriches it, the public site renders a *published projection* of it. Nothing writes back up the chain except the **explicit, coach-approved** GameChanger schedule push.

---

## 2. Monorepo layout

A **Turborepo + pnpm workspaces** monorepo. Next.js 14 (App Router) for both the operations app and the generated public sites, sharing one design system and one data layer.

```
Next-Gen-Rally-OS/
├── apps/
│   ├── rally-os/                 # Coach operations app (the rallyiq successor) — system of record
│   ├── public-site/              # Renderer for a published team site (venom template, Rally-IQ-aware)
│   └── org-builder/              # Rally-Org-Builder: config-driven site generation + deploy
├── packages/
│   ├── core-data/                # Prisma schema + domain models (Team, Player, PracticePlan, ...) — single source of truth
│   ├── ncs/                      # ncs-monitor + NCS-DASH consolidated: search, roster monitor, tournament tracker
│   ├── gamechanger/              # GC team/player mapping, stat import, schedule push (paste-and-parse + approval)
│   ├── ai/                       # Practice-plan builder, player-trend suggestions (Claude API)
│   ├── ui/                       # Shared design system (Venom-styled components, dark neon theme)
│   ├── site-template/            # The "venom" structured template: section modules + config schema
│   └── config/                   # Site config schema (YAML) + validation (zod)
├── services/
│   └── ncs-worker/               # Scheduled NCS polling worker (cron) — emits change-review items
├── infra/                        # IaC: Vercel/Railway config, DB, queues, env contracts
├── docs/                         # Product + dev docs (this package lives here)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Module → repo provenance

| New location | Absorbs |
|---|---|
| `apps/rally-os` | `rallyiq` (all `/dashboard/*` modules, `useStore`/Prisma data layer) |
| `packages/ncs` + `services/ncs-worker` | `ncs-monitor` + `NCS-DASH` |
| `packages/gamechanger` | `rallyiq`'s `src/lib/gcImport.ts` + integrations UI |
| `packages/site-template` | `venom` (refactored from a static template into composable section modules) |
| `apps/org-builder` | `rally-org-builder` (now consuming `packages/site-template`) |
| `apps/public-site` | new — renders a built site from `packages/site-template` + published data |

---

## 3. The Venom template gap → Rally-IQ-aware modules

The current Venom diagram has **public** sections only. To become the structured template foundation, `packages/site-template` must expose every section as a **toggleable module** driven by site config, including the Rally-IQ operational modules that the diagram is missing:

```
Public modules (Venom has these):     Rally-IQ modules (Venom is missing these):
  home                                   player_development   (dev focus, AI suggestions — public-safe view)
  team_info                              coach                 (staff, philosophy)
  standards                              schedule              (approved games only)
  roster                                 tournaments           (NCS-tracked, public view)
  player_profiles                        practice_plans        (player version only — never coach version)
  social_media_hub                       gamechanger_stats     (read-only imported stats + clips)
  fundraising                            integrations_status   (internal only; never published)
```

Rule the template must enforce: **anything coach-private never renders on the public site.** The practice-plan player/coach split and `coach_notes` from the data model are the canonical example — the public renderer only ever receives the published projection, not the operational record.

---

## 4. Core data model (consolidated)

From the demo package's MVP data objects, normalized into `packages/core-data` (Prisma):

```
Team ──< TeamSeason ──< RosterEntry >── Player ──< PlayerProfile
                          │                          ├─ CoachNote
                          │                          └─ DevelopmentFocus
                          ├─ PracticePlan ──< PracticePlanVersion (coach | player)
                          ├─ Drill / DrillLibrary / PracticeTemplate
                          ├─ ScheduleGame ──< SchedulePushRequest
                          └─ external mappings:
                               NcsTeamSource / NcsPlayerSource
                               NcsTournament / NcsTournamentGame / NcsChangeReview
                               GameChangerTeamConnection (gc_team_id, per season)
                               GameChangerPlayerMapping  (gc_player_id, per player)
                               GameChangerStatSnapshot   (read-only)
```

Durable cross-reference keys (carried forward from rallyiq, non-negotiable):
- `gc_team_id` — per `TeamSeason`
- `gc_player_id` — per `Player` (also the future key for per-player GameChanger clip scraping)
- `ncs_player_source` / `ncs_team_source` — highest-priority match key for roster sync

Match priority everywhere external rows meet local players: **external ID → normalized name → jersey**. Never name-only when an ID is present.

---

## 5. The two governance decisions (locked)

These were decided explicitly and the consolidated app must encode them — note they **differ by data type**, matching the demo voiceover:

1. **NCS roster sync → coach-reviewed.** `ncs-worker` detects changes and creates a `NcsChangeReview` item (`change_detected → pending_review → accepted | ignored`). Rally-IQ never overwrites coach-managed roster data automatically.
2. **GameChanger schedule push → coach-approved, never automatic.** NCS-detected tournament games become drafts (`ncs_detected → draft_created → pending_coach_approval → approved → pushed_to_gamechanger`). Only approved games push; Rally-IQ stores the returned `gc_game_id`.

> Note: an earlier rallyiq-only spec (`architecture-spec.md`) recorded a "fully automated" stance for the GameChanger push. The demo package voiceover and acceptance checklist supersede that with the **coach-approval-gated** flow above. Next-Gen-Rally-OS follows the demo package — approval-gated.

---

## 6. Concept → Operations deployment pipeline

The "complete deployment tool" is `apps/org-builder` plus the deploy pipeline. The journey:

```
1. CONCEPT        Coach fills site config (org, team, season, modules, integrations)  → config/*.yaml
2. SITE DESIGN    org-builder validates config (zod) → composes site-template modules → preview
3. PROVISION      org-builder creates the TeamSeason in core-data, seeds Standards/Team Info
4. INTEGRATE      Connect NCS (import roster) + GameChanger (map players) via Integrations Hub
5. OPERATE        Coach runs Rally-IQ: monitoring, tournament approval, profiles, AI practice plans
6. PUBLISH        org-builder builds public-site from the published projection → deploy
7. ITERATE        ncs-worker keeps roster/tournaments live; re-publish on approved changes
```

Example site config (drives steps 1–2, extends the demo package's YAML with the missing Rally-IQ modules):

```yaml
organization: { name: Texas Venom, slug: texas-venom }
team:         { name: Texas Venom 12U, season: 2026, age_group: 12U }
modules:
  home: true
  team_info: true
  standards: true
  roster: true
  player_profiles: true
  schedule: true
  tournaments: true
  practice_plans: true          # player version only on public site
  player_development: true       # public-safe view
  social_media_hub: true
  fundraising: false
integrations:
  ncs: true
  gamechanger: true
publish:
  target: vercel
  domain: texasvenom.rally.app
```

### Deploy targets
- **Operations app (`rally-os`)** + **`ncs-worker`**: one always-on deployment (Vercel for the app, a cron worker on Railway/Vercel Cron). Postgres (Neon/Railway).
- **Public sites**: each generated site is a static/ISR Next.js build deployed per-team (Vercel project per org, or a single multi-tenant app keyed by domain). org-builder owns the deploy call.

---

## 7. Build order (so Copilot can sequence work)

1. Monorepo skeleton (Turborepo + pnpm) + `packages/ui` design system (port Venom's dark-neon theme) + `packages/core-data` Prisma schema.
2. `apps/rally-os` shell: Team Portal dashboard with the nav from the demo (Home, Standards, Team Info, Roster, Player Profiles, NCS Roster Dashboard, NCS Tournament Tracker, Integrations Hub, GameChanger, Coach, Player Development, Teams, Social Media Hub, Fundraising).
3. `packages/ncs` + `services/ncs-worker`: search → import → monitor → change-review.
4. `packages/gamechanger`: connect → map players → import stats → approval-gated schedule push.
5. `packages/ai`: practice-plan builder (coach + player versions) + player-trend suggestions.
6. `packages/site-template`: refactor Venom into config-toggleable modules incl. the missing Rally-IQ ones.
7. `apps/org-builder` + `apps/public-site`: config → compose → preview → publish.
8. `infra/`: env contracts, DB, cron, per-team deploy.

Ship each layer behind the acceptance checklist in `RallyIQ_Documentation_Demo_Package.md §7`.
