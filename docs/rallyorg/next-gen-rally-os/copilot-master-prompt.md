# GitHub Copilot — Master Build Prompt for `Next-Gen-Rally-OS`

Paste the block below into GitHub Copilot Chat (or Copilot Workspace / coding agent) at the root of a **fresh, empty `jeremiah9980/Next-Gen-Rally-OS` repo**. It is written to scaffold the whole monorepo structure and infrastructure first, then build module-by-module. Architecture rationale lives in [`deployment-blueprint.md`](./deployment-blueprint.md).

> Tip: Copilot does best with bounded scope. Run **Prompt 0** first to scaffold, commit, then feed Copilot **one numbered module prompt at a time** (1–8) from the "Module prompts" section. Don't paste all of it at once.

---

## Prompt 0 — Repo scaffold + infrastructure (run first)

```
You are scaffolding a new monorepo: Next-Gen-Rally-OS. It consolidates five existing products
into one system that takes a youth-sports team from concept → public team-site → full coaching
operations:
  - rallyiq        → the coach operations app (system of record)
  - ncs-monitor    → NCS team search + roster/tournament monitoring
  - NCS-DASH       → NCS roster dashboard + tournament control center
  - venom          → a public team-site TEMPLATE (currently missing all operational modules)
  - rally-org-builder → config-driven publishing of public team sites

Stack: TypeScript, Next.js 14 (App Router), Turborepo + pnpm workspaces, Prisma + PostgreSQL,
Tailwind, zod, Claude API (@anthropic-ai/sdk) for AI features. Deploy target: Vercel for apps,
a cron worker for NCS polling, Neon/Railway Postgres.

Create this exact structure with working package.json/tsconfig in each workspace, a root
turbo.json, pnpm-workspace.yaml, and a root README describing the architecture:

apps/
  rally-os/      Coach operations app (system of record). Next.js App Router.
  public-site/   Renders a published team site from packages/site-template.
  org-builder/   Config-driven site generation + deploy (the "deployment tool").
packages/
  core-data/     Prisma schema + domain models. Single source of truth.
  ncs/           NCS search, roster monitor, tournament tracker (absorbs ncs-monitor + NCS-DASH).
  gamechanger/   GC team/player mapping, stat import, approval-gated schedule push.
  ai/            Practice-plan builder + player-trend suggestions (Claude API).
  ui/            Shared design system. Dark neon theme (port the Venom look).
  site-template/ The structured "venom" template as config-toggleable section modules.
  config/        Site config schema (YAML) + zod validation.
services/
  ncs-worker/    Scheduled NCS polling worker. Emits NcsChangeReview items.
infra/           Env contracts (.env.example), DB, cron, per-team deploy notes.
docs/            Product + dev docs.

Requirements for this scaffold step:
- Root scripts: dev, build, lint, typecheck, db:push, db:generate — wired through turbo.
- packages/core-data: Prisma schema with these models and relations (PostgreSQL):
  Team, TeamSeason, Player, RosterEntry, PlayerProfile, CoachNote, DevelopmentFocus,
  PracticePlan, PracticePlanVersion (enum: COACH | PLAYER), Drill, DrillLibrary,
  PracticeTemplate, ScheduleGame, SchedulePushRequest,
  NcsTeamSource, NcsPlayerSource, NcsTournament, NcsTournamentGame, NcsChangeReview,
  GameChangerTeamConnection (field gcTeamId), GameChangerPlayerMapping (field gcPlayerId),
  GameChangerStatSnapshot.
  Cross-reference keys are mandatory: gcTeamId on GameChangerTeamConnection (per TeamSeason),
  gcPlayerId on GameChangerPlayerMapping (per Player), ncs source ids on NcsPlayerSource.
- packages/ui: a Tailwind preset + base components (Card, Badge, Button, Avatar, StatTile, Nav)
  in a dark neon style (deep purple/black background, lime-green + purple accents).
- packages/config: a zod schema for SiteConfig matching this YAML shape:
  organization{name,slug} team{name,season,age_group}
  modules{home,team_info,standards,roster,player_profiles,schedule,tournaments,
          practice_plans,player_development,social_media_hub,fundraising}
  integrations{ncs,gamechanger} publish{target,domain}
- infra/.env.example with: DATABASE_URL, ANTHROPIC_API_KEY, NEXTAUTH_URL, NEXTAUTH_SECRET,
  NCS_POLL_CRON, VERCEL_TOKEN.
- Add a CI workflow (.github/workflows/ci.yml): pnpm install, typecheck, lint, build.
  In the build step set NEXTAUTH_URL fallback to http://localhost:3000 so next-auth doesn't
  crash on an empty URL.

Generate the full scaffold now. Stop after the structure compiles (pnpm install && pnpm typecheck
pass). Do not implement feature modules yet.
```

---

## Shared context (prepend to EVERY module prompt below)

```
Context for Next-Gen-Rally-OS. Rally-OS is the SYSTEM OF RECORD. Data flows one direction:
NCS (intelligence) → Rally-OS (record) → Rally-Org-Builder (publish) → public site. GameChanger
enriches Rally-OS with READ-ONLY stats. Two governance rules are non-negotiable:
  1. NCS roster changes are NEVER auto-applied — they create an NcsChangeReview the coach
     accepts/edits/ignores.
  2. GameChanger schedule games are NEVER auto-pushed — NCS-detected games become drafts the
     coach approves before push; store the returned gcGameId.
External-row → local-player matching priority is ALWAYS: external ID → normalized name → jersey.
Never name-only when an ID column is present. Coach-private data (coach_notes, coach practice
version) must NEVER reach the public site renderer.
```

---

## Module prompts (feed one at a time, after Prompt 0)

### 1 — Rally-OS Team Portal shell (`apps/rally-os`)
```
Build the Team Portal dashboard shell. Left nav with these sections (from the product demo):
Home, Standards, Team Info, Roster, Player Profiles, NCS Roster Dashboard, NCS Tournament Tracker,
Integrations Hub, GameChanger, Coach, Player Development, Teams, Social Media Hub, Fundraising.
Home is a coach dashboard showing the active TeamSeason, athlete count, and a roster grid of
player tiles with AVG/AB/RBI/HR computed live from core-data. Use packages/ui. Team Info +
Standards are editable forms backed by these fields: team_name, season, age_group, organization,
head_coach, assistant_coaches, practice_location, primary_game_location, team_standards,
development_goals, communication_expectations.
```

### 2 — NCS toolset (`packages/ncs` + `services/ncs-worker`)
```
Implement NCS search → roster import → continuous monitoring → change review.
- Roster Dashboard: search NCS team, PREVIEW roster before import, import selected players into
  core-data (create Player + RosterEntry + NcsPlayerSource attached to the active TeamSeason).
- ncs-worker: a scheduled job (NCS_POLL_CRON) that diffs the live NCS roster + tournament
  registrations against stored sources and creates NcsChangeReview items
  (status: change_detected → pending_review → accepted | ignored). NEVER overwrite roster data
  automatically.
- Tournament Tracker: browse upcoming NCS tournaments, attach to TeamSeason schedule, store
  tournament source metadata, detect registered tournaments.
Use the established paste-and-parse pattern where no NCS API is available (validate a team URL,
parse pasted tabular roster/tournament text, fall back to positional parsing without a header).
```

### 3 — GameChanger integration (`packages/gamechanger`)
```
Implement: connect GameChanger to the active TeamSeason (store gcTeamId), map each Rally-OS Player
to a gcPlayerId, import box-score stats as read-only GameChangerStatSnapshot rows. Then the
approval-gated schedule push: NCS-detected tournament games become ScheduleGame drafts
(ncs_detected → draft_created → pending_coach_approval → approved → pushed_to_gamechanger | rejected).
Coach can edit opponent/date/time/field/location/game_type, approve all or selected, reject.
Only approved games push; store the returned gcGameId on a SchedulePushRequest. Stat import must
match by gcPlayerId → normalized name → jersey. Never write back to GameChanger except the
approved push. The import form must collect real result/score — never hardcode a result.
```

### 4 — AI practice planning + player suggestions (`packages/ai`)
```
Use @anthropic-ai/sdk (model claude-sonnet-4-6) to build:
- Practice Plan Builder: inputs = team_id, team_season_id, practice_date, duration, location,
  team_focus, recent_game_stats, recent_player_notes, available_coaches, available_players,
  drill_library. Output a structured PracticePlan and TWO PracticePlanVersions:
    COACH: full_schedule, coach_assignments, drill_instructions, player_groups,
           private_player_notes, development_focus, ai_suggestions, equipment, contingency_plan.
    PLAYER: practice_time, practice_location, practice_blocks, drills, expectations,
            equipment_to_bring, team_focus.
  The PLAYER version must exclude all private coach notes.
- Player-trend suggestions: from recent GameChangerStatSnapshots + CoachNotes, summarize recurring
  errors / improvement areas / development focus as advisory DevelopmentFocus + ai-tagged notes.
  Advisory only — never auto-edit other fields.
Save every plan/drill into the reusable DrillLibrary / PracticeTemplate.
```

### 5 — Venom site-template as modules (`packages/site-template`)
```
Refactor the Venom team-site template into config-toggleable section modules. Public modules:
home, team_info, standards, roster, player_profiles, social_media_hub, fundraising. ADD the
Rally-IQ operational modules the Venom template is currently missing, in PUBLIC-SAFE form:
schedule (approved games only), tournaments (NCS-tracked public view), practice_plans (PLAYER
version only — never coach), player_development (public-safe dev view), gamechanger_stats
(read-only imported stats + clips). Each module reads a PUBLISHED PROJECTION of core-data, never
the operational record. integrations_status is internal-only and must never publish. Keep the dark
neon Venom visual identity from packages/ui.
```

### 6 — Rally-Org-Builder deployment tool (`apps/org-builder` + `apps/public-site`)
```
Build the concept→operations deployment tool. Flow: (1) coach edits SiteConfig YAML (validated by
packages/config zod schema); (2) org-builder composes the enabled site-template modules into a
preview; (3) provision the TeamSeason in core-data and seed Standards/Team Info; (4) after the
coach connects NCS + GameChanger and operates Rally-OS, (5) org-builder builds apps/public-site
from the published projection and deploys (publish.target = vercel, publish.domain). Re-publish on
approved NCS changes. Provide a CLI (`rally-os build <config.yaml>`) and a UI wizard mirroring the
same steps.
```

### 7 — Auth + tenancy (`apps/rally-os`)
```
Add next-auth (credentials + email) with org/team-scoped access. A coach belongs to an
organization and sees only their TeamSeasons. Public-site reads are unauthenticated but only ever
receive the published projection. Set NEXTAUTH_URL/NEXTAUTH_SECRET; ensure build doesn't crash on
empty NEXTAUTH_URL.
```

### 8 — Infra + deploy (`infra/`)
```
Finalize infrastructure: Prisma migrations + seed; Vercel config for rally-os and a per-team
public-site project; a cron schedule for ncs-worker; documented env contract; a Makefile/turbo
tasks for db:migrate, seed, deploy. Add a smoke-test checklist mapping to the demo acceptance
criteria (Team Portal, NCS, GameChanger, Tournament Schedule, Practice Planning).
```

---

## Acceptance gate

Each module is "done" only when it passes the matching section of the acceptance checklist in
`RallyIQ_Documentation_Demo_Package.md §7`. Wire that checklist into `docs/` as living acceptance
criteria and check items off as Copilot completes them.
