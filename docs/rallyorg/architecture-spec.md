# SPEC-1: Rally-IQ Player Operations & Development Platform

## Background

Rally-IQ is a youth/travel-sports team operations platform centered on three pillars: coaching workflow (practice planning, player development notes), roster/identity management, and integration with external platforms that have no public API for arbitrary teams (GameChanger for live stats/schedules, NCS Fastpitch for team/tournament discovery).

Today, `rallyiq` implements a client-side store (`src/lib/store.ts`, `localStorage`-backed `useStore()` hook) holding `Player`, `Game`, and `Store.settings`, plus two "paste-and-parse" integrations (GameChanger, NCS) that let a coach manually copy tabular data from an external site, parse it client-side, and cross-reference it against the local roster using a priority chain of **linked external ID → normalized name → jersey number**.

The product vision extends this further:
- AI-assisted practice planning, producing both a coach version (assignments, station ownership, drills, private notes) and a simplified player-facing version.
- Coach notes on individual players, with AI suggestions derived from recent stat trends and recorded errors.
- A reusable library of practices and drills.
- NCS team search to import a roster directly into Rally-IQ.
- NCS tournament discovery, with tournament add-to-schedule support.
- When a team is registered for an NCS tournament, automatic creation of the corresponding games in the GameChanger schedule.
- GameChanger integration that tracks a per-season team ID (`gc_team_id`) and a per-player ID (`gc_player_id`), and imports all stats from GameChanger.
- A separate marketing/product site (built on `venom`) and an org-builder tool (`Rally-Org-Builder`) that should consume `venom` as its structured template foundation.

This effort spans four repositories: `rallyiq` (this repo, full access), `ncs-monitor`, `venom`, and `Rally-Org-Builder` (no access in this session — see Cross-Repo Handoff below).

Two architecture decisions were explicitly made by the product owner during this session, and **override the MVP defaults this spec would otherwise suggest**:

1. **GameChanger schedule creation from NCS tournament registration is fully automated.** When `ncs-monitor` (or the rallyiq NCS integration) detects the team is registered for a tournament, the corresponding games are pushed into the GameChanger schedule directly — there is no coach-approval gate in the loop. (The conservative default would have been to stage the games for coach review before pushing; that default was explicitly rejected.)
2. **NCS roster sync is continuous monitoring with auto-update**, not a one-time import. Once a team is linked, roster changes on NCS should propagate into Rally-IQ on an ongoing basis without the coach re-running a manual paste each time. (The conservative default would have been "import once, then manage manually in Rally-IQ"; that default was explicitly rejected.)

## Requirements

### Must Have
- Track `gc_team_id` per season on `Store.settings` and `gc_player_id` (`Player.gcId`) per player as the highest-priority, durable cross-reference keys for all GameChanger data (stats, and future per-player video clips).
- GameChanger stat import matches rows to players by ID first, name second, jersey third — never name-only when an ID column is present (this was a real regression fixed in this repo; see `src/lib/gcImport.ts`).
- GameChanger schedule sync: when an NCS tournament registration is detected for the team, automatically create the matching games in the GameChanger-tracked schedule (`Game.source: 'ncs'` or equivalent), including a real result/score capture path — never a hardcoded placeholder result.
- NCS team search → roster import into Rally-IQ, writing/merging into `Store.players` without clobbering coach-entered fields (notes, position overrides, etc).
- NCS roster sync runs continuously (poll/webhook-driven from `ncs-monitor`) and auto-applies roster changes (adds, jersey/position changes) rather than requiring a re-paste.
- Coach-facing player notes with freeform text, persisted per player.
- Practice plan generation producing two renderings from one underlying plan: a coach version (full detail: assignments, drill ownership, private notes) and a player version (schedule/expectations only, no private notes).
- A drill/practice library that practice plans can be composed from and saved back into.
- All new data model fields are optional additions to existing interfaces (`Player`, `Game`, `Store.settings`) — no breaking migration of persisted `localStorage` data.

### Should Have
- AI-generated player development suggestions surfaced on the player profile, derived from recent game-stat trends (e.g., rising/falling AVG, OBP, K rate) and any logged errors/notes — advisory only, coach reviews before acting.
- A "Recently synced" / activity feed per integration (already established pattern) extended to cover NCS continuous sync events, not just one-shot imports.
- Drill library tagging (by skill, position, age group) to support AI-assisted plan generation pulling relevant drills.
- Notifications/toasts when continuous NCS sync detects a roster or schedule change, so the auto-applied change is visible to the coach after the fact (since there is no pre-approval gate).

### Could Have
- A `venom`-templated marketing/product site for Rally-IQ itself, once `venom` access is available.
- Cross-team drill/practice library sharing (e.g., org-level library shared across multiple Rally-IQ teams under the same organization).
- AI-assisted opponent scouting using historical GameChanger stat data, once enough seasons of imported data exist.

### Won't Have (this phase)
- Any direct write-back from Rally-IQ into GameChanger or NCS (both integrations remain read/import-oriented paste-and-parse or monitored-pull; Rally-IQ does not author content on those platforms beyond what's explicitly described above for schedule push, which is a one-directional create-if-missing operation, not bidirectional sync).
- OAuth/API-key-based auth for GameChanger or NCS — neither platform exposes a public API for arbitrary teams; the existing paste-and-parse + monitored-scrape pattern continues to be the integration mechanism.
- Code or migrations executed directly against `ncs-monitor`, `venom`, or `Rally-Org-Builder` in this session (no repo access — see Cross-Repo Handoff).

## Method

### Data model (`rallyiq`, `src/lib/store.ts`)
- `Player.gcId?: string` — already present; the GameChanger per-player cross-reference key.
- `Store.settings.gcTeamId?: string` — per-season GameChanger team ID; add an explicit `gcSeason?: string` alongside it so re-linking a new season doesn't silently overwrite the prior season's ID without a record of which season it applied to.
- `Player.ncsId?: string` — new, mirrors `gcId`'s role for NCS-sourced players: highest-priority match key for roster sync.
- `Store.settings.ncsTeamId?: string`, `ncsSyncEnabled?: boolean`, `ncsLastSyncAt?: string` — link state and continuous-sync toggle/status for the NCS integration, following the existing `<platform>Verified`/`<platform>LastSync` convention used by GameChanger.
- `Game.source?: 'manual' | 'gamechanger' | 'ncs'` — extend the existing `source` tag (already `'manual' | 'gamechanger'`-shaped per the integration skill) to include `'ncs'` for auto-created tournament games, so the "Recently synced" feed can filter and label them distinctly from manually-entered or GameChanger-imported games.
- `PracticePlan` (new top-level store collection): `{ id, date, teamId, drills: DrillRef[], assignments: Record<stationId, coachId>, coachNotes: string, playerVisibleNotes: string }`. The coach view renders all fields; the player view renders everything except `coachNotes` and the raw `assignments` coach IDs (shown instead as station names/times only).
- `Drill` (new top-level store collection): `{ id, name, tags: string[], description, durationMin }` — the reusable library practice plans draw from.
- `PlayerNote` (new, keyed by `playerId`): `{ id, playerId, text, createdAt, aiSuggested?: boolean }` — coach notes; AI-suggested notes are flagged distinctly so they're visually distinguishable from coach-authored ones and require no separate approval step to display (advisory, not auto-applied to any other field).

### NCS continuous roster sync flow
1. Coach links a team via NCS team search (existing paste/URL pattern) and toggles `ncsSyncEnabled`.
2. `ncs-monitor` (cross-repo, not actioned this session) is responsible for the actual continuous polling/scraping of the NCS team page on a schedule and exposing a diff (added/removed/changed players) — Rally-IQ does not poll NCS directly from the browser client.
3. Rally-IQ consumes that diff (via whatever transport `ncs-monitor` exposes — webhook, polling its own endpoint, or a shared queue; left open pending repo access) and applies it to `Store.players`: match by `ncsId` first, then name, then jersey; new NCS players are added, changed fields (jersey, position) are updated, removed players are flagged rather than deleted (to preserve historical game-stat linkage).
4. Each applied diff updates `ncsLastSyncAt` and appends to the synced-items feed so the coach can see what changed, after the fact — there is no pre-approval step, per the explicit "continuous monitoring/auto-update" decision.

### NCS tournament → GameChanger schedule automation flow
1. NCS tournament finder/search surfaces tournaments to the coach; adding one to the schedule creates a lightweight `Tournament` record (or reuses `Game` rows with a `tournamentId` grouping field) and checks team registration status.
2. When registration is confirmed (whether by coach action or detected via continuous monitoring), Rally-IQ automatically creates the full set of games for that tournament in the GameChanger-tracked schedule — `Game.source = 'ncs'`, `Game.gcTeamId` stamped from `settings.gcTeamId` — with no coach-approval gate, per the explicit "fully automated" decision.
3. Game result/score fields (`res`, `us`, `them`) are left unset/null at auto-creation time (the tournament feed doesn't carry final scores in advance) and are filled in normally through the existing GameChanger stats-import Step 3 flow once the game is played — this avoids repeating the hardcoded-result bug already fixed in `gcImport.ts`/`gamechanger/page.tsx`.
4. Auto-created games appear in the "Recently synced" feed tagged by source so the coach can audit what was auto-pushed.

### GameChanger stat import flow (existing, unchanged)
Paste roster/box-score → `parseGCRoster`/`parseGCBoxScore` → match by `gcId` → `gcId` → name → jersey (already implemented in `src/lib/gcImport.ts`) → import into `Store.games[].stats[playerId]`. No changes required here; referenced for completeness since practice-plan AI suggestions and player notes consume this same stat data.

### AI practice plan generation
1. Coach selects players/team, optionally a focus area (e.g., "infield drills," "bunt defense").
2. Generation step composes a `PracticePlan` by selecting `Drill` entries matching the focus tags, assigning stations to coaches, and drafting `coachNotes` (private) and `playerVisibleNotes` (public) text.
3. Coach view renders the full plan; a "Player View" toggle/share link renders the filtered version (no `coachNotes`, no coach-ID assignment detail — station names/times only).
4. Saved plans persist to the `PracticePlan` collection and can be cloned/reused, building the drill/practice library over time.

### AI player development suggestions
1. On each profile view, compute recent-trend deltas from `calcStats()` output across a trailing window of games (e.g., last 5 vs. season average) for AVG/OBP/K-rate/etc.
2. Surface suggestions as `PlayerNote` entries with `aiSuggested: true`, visually distinct, advisory only — they do not auto-modify any other player field.

## Repo Responsibilities

| Repo | Role | Status this session |
|---|---|---|
| `rallyiq` | Player Ops & Development app: store/data model, practice plans, player notes, drill library, GameChanger integration, NCS integration (client-facing import/link UI), schedule automation logic | Full access — implemented/specified directly in this repo |
| `ncs-monitor` | Continuous off-platform monitoring of NCS team/tournament pages: scraping, diffing, and exposing roster/tournament-registration changes for `rallyiq` to consume | No access — handoff only |
| `venom` | Structured site/template foundation — intended to become the base template that `Rally-Org-Builder` consumes for generating org sites | No access — handoff only |
| `Rally-Org-Builder` | Org-site builder tool; should be updated to consume `venom` as its structured template foundation instead of its current approach | No access — handoff only |

## Cross-Repo Handoff (not actioned this session — needs repo access)

The following work items are specified here for hand-off but were **not implemented**, because this session's GitHub MCP access is scoped to `jeremiah9980/rallyiq` only:

### `ncs-monitor`
- Implement continuous polling/scraping of a linked NCS team page on a recurring schedule (interval TBD by `ncs-monitor`'s existing scheduling mechanism, if any).
- Implement continuous polling/monitoring of NCS tournament registration status for linked teams.
- Expose a diff/event interface (roster added/removed/changed; tournament-registration-confirmed) that `rallyiq` can consume — transport (webhook vs. polling endpoint vs. queue) to be decided once repo access and existing infra are visible.
- Persist enough history to avoid re-emitting already-applied diffs (idempotency on the consuming side, `rallyiq`, should not be relied upon as the only safeguard).

### `venom`
- Confirm/establish `venom`'s existing site-template structure (page composition, theming, content model) as a reusable foundation.
- Define the contract (template schema, theming hooks, content slots) that `Rally-Org-Builder` would consume.
- Produce or confirm a Rally-IQ marketing/product site built on this template (Could Have, lower priority than the `Rally-Org-Builder` consumption work).

### `Rally-Org-Builder`
- Replace or extend its current org-site generation approach to consume `venom` as its structured template foundation per the contract defined above.
- Audit existing generated-site output for parity with the new `venom`-based templates before cutting over.

These items should be re-scoped into actionable tickets once `ncs-monitor`, `venom`, and `Rally-Org-Builder` are added to an accessible session (see `list_repos`/`add_repo` tooling for the Claude Code remote environment).
