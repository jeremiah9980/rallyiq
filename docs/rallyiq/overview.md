# RallyIQ — Platform Overview

RallyIQ is a full-featured sports management platform built for youth and travel sports clubs. It consolidates coaching tools, athlete management, fundraising, scouting, and team communications into a single role-based web application powered by AI.

---

## What RallyIQ Does

RallyIQ replaces disconnected tools (spreadsheets, group chats, paper rosters, separate fundraising platforms) with one integrated system. Coaches plan practices with AI, track player development over time, manage game schedules, run fundraising campaigns, scout competitors, and communicate with families — all from a single dashboard.

---

## Core Modules

| Module | Who Uses It | Key Capabilities |
|--------|------------|-----------------|
| **Coach AI** | Coaches | AI practice planning, player development notes, chat assistant |
| **Teams** | Coaches, Admins | Roster management, game tracking, schedules, tournaments, communications |
| **Profiles** | Coaches, Players | Athlete profiles, video highlights, recruiting snapshot tracking |
| **Fundraise** | Admins, Coaches | Donation campaigns, sponsor management, booster tracking, AI fundraising plans |
| **Scout** | Coaches | AI drill library, competitor intelligence, tryout pipeline, roster intel |
| **Org** | Admins | Multi-team management, organization financials, sponsor oversight, branding |
| **Integrations** | Admins, Coaches | GameChanger, Band, NCS Fastpitch, social media, video highlight editing |

---

## Roles and Access

RallyIQ uses four roles, each with a different view and level of access:

### Admin
- Full access to all modules
- Manages organizations, teams, users, and finances
- Can see financial reports, all team data, and org-level sponsors
- Controls integration configurations and branding templates

### Coach
- Access to Coach AI, Teams, Profiles, Scout, and Integrations
- Creates and manages practices, notes, development summaries
- Tracks game results and player stats
- Plans tournaments and communicates with families

### Player
- Access to their own profile
- Views their schedule, development notes from coaches, and highlights
- Can view their recruiting snapshot

### Parent
- Access to the parent portal
- Views their child's schedule, games, and events
- Receives team communications
- Can participate in fundraising campaigns

---

## User Portals

In addition to the main dashboard, RallyIQ includes three dedicated portals optimized for each non-admin role:

| Portal | URL | Audience |
|--------|-----|----------|
| Coach Portal | `/portals/coach` | Quick-access coaching view |
| Player Portal | `/portals/player` | Athlete's personal view |
| Parent Portal | `/portals/parent` | Family communication and fundraising |

See [Portals Documentation](portals.md) for full details.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 18 |
| Styling | Tailwind CSS | 3.4 |
| Icons | Lucide React | 0.468 |
| Charts | Recharts | 2.13 |
| Database ORM | Prisma | 5.22 |
| Database (local) | SQLite | — |
| Database (production) | PostgreSQL | — |
| Authentication | NextAuth.js | 4.24 |
| Password hashing | bcryptjs | 2.4 |
| Server state | TanStack React Query | 5.62 |
| Validation | Zod | 3.23 |
| AI | Anthropic Claude API | claude-sonnet-4-20250514 |
| Markdown | marked.js | — |
| Date utils | date-fns | 4.1 |

---

## Application Architecture

```
Browser
  │
  ├── Landing Page (/)            — Public marketing site
  ├── Auth Pages (/login, /register) — NextAuth credential auth
  ├── Portals (/portals/*)        — Role-specific public views
  └── Dashboard (/(dashboard)/)   — Protected application
       ├── Coach AI (/coach)
       ├── Teams (/teams)
       ├── Profiles (/profiles)
       ├── Fundraise (/fundraise)
       ├── Scout (/scout)
       ├── Org (/org)
       └── Integrations (/integrations)
            │
            └── API Layer (/api/*)
                 ├── /api/auth/[...nextauth]
                 ├── /api/teams
                 ├── /api/players
                 ├── /api/practices
                 ├── /api/schedules
                 ├── /api/campaigns
                 ├── /api/scouts
                 └── /api/integrations
                      │
                      └── Prisma ORM → Database (SQLite / PostgreSQL)
```

---

## AI Architecture

RallyIQ uses the Anthropic Claude API directly from the browser via a streaming fetch hook (`src/hooks/useStream.ts`). The model used is `claude-sonnet-4-20250514`.

AI is integrated into:
- **Practice planner** — generates dual coach/player version practice plans
- **Coach chat** — open-ended AI coaching assistant
- **Tournament itinerary** — generates coach and parent versions
- **Drill library** — generates categorized drill guides
- **Fundraising plans** — generates coordinator and family versions
- **Integration briefings** — summarizes cross-platform activity into action items
- **Message composer** — generates team announcements for Band/GameChanger

See [AI Features Documentation](ai-features.md) for full details.

---

## Pricing (from Landing Page)

| Plan | Price/month | Best For |
|------|------------|----------|
| Starter | $49 | Single team, up to 20 players |
| Pro | $149 | Multiple teams, advanced analytics |
| Org | $399 | Full club, white-label, all integrations |

---

## Navigation Structure

The sidebar provides access to all modules:

```
Dashboard
├── Coach AI
│   ├── Practice Planner
│   ├── Player Notes
│   └── Development
├── Teams
│   ├── Roster
│   ├── Schedule
│   ├── Tournaments
│   └── Communications
├── Profiles
│   ├── [Player] Overview
│   ├── [Player] Videos
│   └── [Player] Recruiting
├── Fundraise
│   ├── Campaigns
│   ├── Sponsors
│   └── Boosters
├── Scout
│   ├── Drill Library
│   ├── Competitors
│   ├── Roster Intel
│   └── Tryouts
├── Org (Admin)
│   ├── Teams
│   ├── Sponsors
│   └── Financials
└── Integrations
    ├── Band
    ├── GameChanger
    ├── NCS
    ├── Social
    ├── Video Highlights
    └── Branding
```

---

## Key Differentiators

1. **AI-native** — Claude powers practice planning, drill guides, fundraising plans, tournament itineraries, and a coaching chat assistant
2. **Role-based** — Separate optimized views for admins, coaches, players, and parents
3. **Integrated portals** — Players and parents get their own dedicated read-only views
4. **Dual-output AI** — Practice plans and fundraising plans generate two versions simultaneously (coach/coordinator and player/family)
5. **Third-party sync** — Native integration hub for GameChanger, Band, and NCS Fastpitch
6. **Recruiting pipeline** — Built-in athlete profile and recruiting snapshot tracking
7. **Financial visibility** — Org-level financial reporting, sponsor management, and campaign tracking
