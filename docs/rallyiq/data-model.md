# RallyIQ Data Model

Complete reference for all 22 Prisma models in the RallyIQ schema.

---

## Domain Overview

| Domain | Models |
|--------|--------|
| Auth | User, Account, Session, VerificationToken |
| Core | Organization, Team, Coach, Player |
| Practice & Development | Practice, PracticeNote, PlayerNote, DevelopmentSummary |
| Scheduling | Schedule, Tournament, TournamentGame |
| Communications | Communication, Message |
| Athlete & Recruiting | AthleteProfile, VideoHighlight, VideoClip, RecruitingSnapshot |
| Fundraising | Sponsor, DonationCampaign, Donation |
| Scouting | ScoutReport, Competitor, TryoutCandidate |
| Org & Admin | FinancialReport, IntegrationConfig, BrandingTemplate |

---

## Auth Domain

### User

The central identity model. Every person in the system is a User with a role.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key, cuid |
| name | String? | Display name |
| email | String | Unique |
| emailVerified | DateTime? | OAuth verification timestamp |
| image | String? | Profile photo URL |
| password | String? | bcrypt hash (null for OAuth users) |
| role | String | `admin` \| `coach` \| `player` \| `parent` (default: `player`) |
| organizationId | String? | FK → Organization |
| createdAt | DateTime | Auto-set on create |
| updatedAt | DateTime | Auto-updated |

**Relations:** accounts, sessions, organization, coachProfile, playerProfile

---

### Account

OAuth provider accounts linked to a User. Managed automatically by NextAuth.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| userId | String | FK → User |
| type | String | OAuth, email, credentials |
| provider | String | google, github, etc. |
| providerAccountId | String | Provider's user ID |
| refresh_token | String? | OAuth refresh token |
| access_token | String? | OAuth access token |
| expires_at | Int? | Token expiry (Unix timestamp) |
| token_type | String? | Bearer, etc. |
| scope | String? | OAuth scopes |
| id_token | String? | JWT from provider |
| session_state | String? | Provider session state |

**Unique:** `provider` + `providerAccountId`

---

### Session

Active user sessions (JWT strategy — sessions are stored in tokens, not DB rows, but this model exists for the Prisma adapter).

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| sessionToken | String | Unique token |
| userId | String | FK → User |
| expires | DateTime | Session expiry |

---

### VerificationToken

Email verification tokens for magic link and email confirmation flows.

| Field | Type | Notes |
|-------|------|-------|
| identifier | String | Email address |
| token | String | Unique verification token |
| expires | DateTime | Token expiry |

**Unique:** `identifier` + `token`

---

## Core Domain

### Organization

The top-level entity. All teams, sponsors, campaigns, and settings belong to an Organization.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Display name |
| slug | String | Unique URL-safe identifier |
| logoUrl | String? | Logo image URL |
| primaryColor | String? | Brand hex color |
| sport | String? | Primary sport |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** users, teams, sponsors, campaigns, financials, integrations, branding

---

### Team

A single sports team within an organization.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Team name |
| sport | String | softball, baseball, soccer, etc. |
| ageGroup | String | 10U, 12U, 14U, 16U, 18U |
| season | String | Spring 2025, Fall 2025, etc. |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** organization, coaches, players, schedules, tournaments, communications, practices

---

### Coach

A user's coaching profile. A User with role `coach` has one Coach record.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| userId | String | Unique FK → User |
| bio | String? | Coach biography |
| specialties | String? | Comma-separated specialty areas |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** user, teams, practices, playerNotes, scoutReports

---

### Player

A user's athlete profile. A User with role `player` has one Player record.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| userId | String | Unique FK → User |
| number | String? | Jersey number |
| position | String? | Playing position |
| grade | String? | Academic grade |
| gpa | String? | Grade point average |
| height | String? | e.g. "5'4\"" |
| weight | String? | e.g. "115" |
| teamId | String? | FK → Team |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** user, team, athleteProfile, playerNotes, developmentSummaries, tryoutCandidates

---

## Practice & Development Domain

### Practice

A planned practice session.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| title | String | Practice title |
| date | DateTime | Scheduled date and time |
| duration | Int | Length in minutes |
| location | String? | Field or facility |
| objectives | String? | Goals for the session |
| notes | String? | Coach notes |
| teamId | String | FK → Team |
| coachId | String | FK → Coach |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** team, coach, practiceNotes

---

### PracticeNote

Notes recorded during or after a practice.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| content | String | Note text |
| practiceId | String | FK → Practice |
| createdAt | DateTime | |

---

### PlayerNote

A coach's development note for a specific player.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| content | String | Note content |
| category | String | `technical` \| `tactical` \| `mental` \| `physical` \| `leadership` |
| playerId | String | FK → Player |
| coachId | String | FK → Coach |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** player, coach

---

### DevelopmentSummary

A periodic (quarterly) development assessment for a player.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| period | String | e.g. "Q2 2025" |
| summary | String | Overall assessment |
| strengths | String | What the player does well |
| improvements | String | Areas to work on |
| goals | String | Targets for next period |
| rating | Int | 1–10 overall score |
| playerId | String | FK → Player |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Scheduling Domain

### Schedule

A single event on a team's calendar.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| title | String | Event title |
| type | String | `game` \| `practice` \| `tournament` \| `event` |
| date | DateTime | Event date |
| time | String? | Human-readable time |
| location | String? | Venue or field |
| opponent | String? | For games |
| result | String? | e.g. "W 8-3" |
| notes | String? | Additional info |
| teamId | String | FK → Team |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### Tournament

A tournament event with multiple games inside it.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Tournament name |
| location | String | City or complex name |
| startDate | DateTime | First day |
| endDate | DateTime | Last day |
| division | String? | Age/skill division |
| placement | String? | Final placement (e.g. "2nd Place") |
| teamId | String | FK → Team |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** team, games (TournamentGame[])

---

### TournamentGame

An individual game within a tournament.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| round | String | Pool play, bracket, semis, finals |
| opponent | String | Opponent team name |
| ourScore | Int? | Our score |
| theirScore | Int? | Opponent score |
| result | String? | W / L / T |
| date | DateTime | Game date and time |
| tournamentId | String | FK → Tournament |
| createdAt | DateTime | |

---

## Communications Domain

### Communication

A message sent to team members.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| subject | String | Message subject |
| body | String | Message content |
| type | String | `email` \| `sms` \| `notification` |
| sentBy | String | Sender name or ID |
| sentAt | DateTime | When it was sent |
| teamId | String | FK → Team |
| createdAt | DateTime | |

---

### Message

A direct message between two users.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| threadId | String | Groups messages into threads |
| fromUserId | String | Sender FK → User |
| toUserId | String | Recipient FK → User |
| content | String | Message body |
| read | Boolean | Read status (default: false) |
| createdAt | DateTime | |

---

## Athlete & Recruiting Domain

### AthleteProfile

Extended profile for a player including bio and stats.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| bio | String? | Athlete biography |
| achievements | String? | Awards and accomplishments |
| stats | String? | JSON string of season stats |
| gpa | String? | Academic GPA |
| graduationYear | Int? | Expected graduation year |
| collegeInterest | String? | Target division or schools |
| playerId | String | Unique FK → Player |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** player, videoHighlights, recruitingSnapshots

---

### VideoHighlight

A highlight reel or video for an athlete.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| title | String | Video title |
| url | String | Video URL |
| thumbnailUrl | String? | Thumbnail image URL |
| duration | Int? | Length in seconds |
| description | String? | Description or context |
| athleteProfileId | String | FK → AthleteProfile |
| createdAt | DateTime | |

**Relations:** athleteProfile, videoClips (VideoClip[])

---

### VideoClip

An individual clip within a highlight reel.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| title | String | Clip title |
| url | String | Clip URL |
| thumbnailUrl | String? | Thumbnail |
| startTime | Int? | Start time in seconds |
| endTime | Int? | End time in seconds |
| tags | String? | Comma-separated tags |
| highlightId | String | FK → VideoHighlight |
| createdAt | DateTime | |

---

### RecruitingSnapshot

A college or program contact in a player's recruiting pipeline.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| college | String | College or university name |
| division | String? | NCAA Division I, II, III, NAIA |
| status | String | `interested` \| `contacted` \| `visited` \| `committed` |
| notes | String? | Recruiting notes |
| contactDate | DateTime? | Date of last contact |
| athleteProfileId | String | FK → AthleteProfile |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Fundraising Domain

### Sponsor

A corporate sponsor of the organization.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Company name |
| logoUrl | String? | Logo URL |
| website | String? | Company website |
| tierLevel | String | `platinum` \| `gold` \| `silver` \| `bronze` |
| amount | Float? | Annual sponsorship amount |
| contactName | String? | Primary contact |
| contactEmail | String? | Contact email |
| active | Boolean | Active status (default: true) |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### DonationCampaign

A fundraising campaign with a goal and time period.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| title | String | Campaign name |
| description | String? | Campaign description |
| goal | Float | Fundraising goal in dollars |
| raised | Float | Amount raised (default: 0) |
| startDate | DateTime | Campaign start |
| endDate | DateTime | Campaign end |
| active | Boolean | Active status (default: true) |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Relations:** organization, donations (Donation[])

---

### Donation

An individual donation to a campaign.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| amount | Float | Donation amount |
| donorName | String | Donor's name |
| donorEmail | String? | Donor's email |
| message | String? | Optional note from donor |
| anonymous | Boolean | Anonymous flag (default: false) |
| campaignId | String | FK → DonationCampaign |
| createdAt | DateTime | |

---

## Scouting Domain

### ScoutReport

A scouting report written by a coach.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| subject | String | What or who is being scouted |
| content | String | Full report text |
| tags | String? | Comma-separated tags |
| priority | String | `high` \| `medium` \| `low` (default: `medium`) |
| coachId | String | FK → Coach |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### Competitor

An opposing team being monitored.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Team name |
| sport | String | Sport |
| division | String? | Age group or division |
| wins | Int? | Win count |
| losses | Int? | Loss count |
| notes | String? | General scouting notes |
| lastScouted | DateTime? | Date last observed |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### TryoutCandidate

A prospective player in the tryout evaluation pipeline.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Candidate name |
| position | String? | Position trying out for |
| age | Int? | Candidate age |
| rating | Int? | Evaluation rating 1–10 |
| notes | String? | Evaluation notes |
| status | String | `pending` \| `invited` \| `accepted` \| `rejected` |
| playerId | String? | FK → Player (if accepted and converted) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Org & Admin Domain

### FinancialReport

A periodic financial summary for an organization.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| period | String | e.g. "Q1 2025" |
| revenue | Float | Total revenue |
| expenses | Float | Total expenses |
| donations | Float | Donation income |
| sponsorships | Float | Sponsorship income |
| notes | String? | Additional commentary |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### IntegrationConfig

Configuration for a third-party platform integration.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| service | String | `band` \| `ncs` \| `gamechanger` \| `instagram` \| `twitter` \| `youtube` \| `tiktok` |
| enabled | Boolean | Active status (default: false) |
| config | String? | JSON string of service credentials |
| lastSynced | DateTime? | Timestamp of last sync |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

### BrandingTemplate

A white-label branding configuration for an organization.

| Field | Type | Notes |
|-------|------|-------|
| id | String | Primary key |
| name | String | Template name |
| primaryColor | String? | Hex color |
| secondaryColor | String? | Hex color |
| fontFamily | String? | Font name |
| logoUrl | String? | Organization logo URL |
| templateData | String? | JSON string of full template config |
| organizationId | String | FK → Organization |
| createdAt | DateTime | |
| updatedAt | DateTime | |

---

## Entity Relationship Summary

```
Organization
├── User[] (members)
├── Team[]
│   ├── Coach[] (many-to-many via relation)
│   ├── Player[]
│   │   ├── AthleteProfile
│   │   │   ├── VideoHighlight[]
│   │   │   │   └── VideoClip[]
│   │   │   └── RecruitingSnapshot[]
│   │   ├── PlayerNote[]
│   │   ├── DevelopmentSummary[]
│   │   └── TryoutCandidate[]
│   ├── Practice[]
│   │   └── PracticeNote[]
│   ├── Schedule[]
│   ├── Tournament[]
│   │   └── TournamentGame[]
│   └── Communication[]
├── Sponsor[]
├── DonationCampaign[]
│   └── Donation[]
├── FinancialReport[]
├── IntegrationConfig[]
└── BrandingTemplate[]

Coach
├── Practice[]
├── PlayerNote[]
└── ScoutReport[]
```
