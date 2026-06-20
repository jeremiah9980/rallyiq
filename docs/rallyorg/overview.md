# Rally-Org Overview

Rally-Org is the organization-level administration layer within RallyIQ. While the rest of RallyIQ is focused on individual coaches and teams, Rally-Org gives club directors, athletic directors, and organization administrators a unified view of their entire operation — across all teams, all finances, all sponsors, and all integrations.

---

## Purpose

A travel sports club often runs 6–20 teams simultaneously across different age groups, sports, and seasons. Rally-Org answers the questions that no single coach can see:

- Which teams are on track financially and which are over budget?
- Which sponsors are renewing and which need outreach?
- What is the organization's total revenue vs. expenses this quarter?
- How does our fundraising compare across teams?
- Are all our integrations (GameChanger, Band, NCS) connected and syncing?
- What does our public branding look like across platforms?

---

## Who Uses Rally-Org

| Role | Access Level |
|------|-------------|
| Admin | Full access — all Rally-Org modules |
| Coach | Read-only access to their own team's data |
| Player | No access |
| Parent | No access |

Rally-Org is an admin-only layer. Coaches see their individual team data through the Teams and Coach modules; only admins see the cross-team organizational view.

---

## Modules

### Teams Management (`/org/teams`)

A consolidated table of every team in the organization. Admins can see:
- Team name and age group
- Roster size
- Season record
- Head coach assignment
- Budget allocated vs. spent
- Active/inactive status

Use this to identify budget overruns, unassigned teams, or underperforming squads at a glance.

---

### Sponsor Management (`/org/sponsors`)

Organization-level sponsor tracking with tier classification:

| Tier | Typical Value |
|------|--------------|
| Platinum | Largest sponsors, featured placement |
| Gold | Mid-tier sponsors |
| Silver | Standard sponsors |
| Bronze | Small or in-kind sponsors |

Each sponsor record includes contact information, annual commitment amount, website, and active status. Admins can manage the full sponsor portfolio from one screen.

---

### Financial Reporting (`/org/financials`)

Quarterly financial reports showing the full org P&L:

| Line Item | Description |
|-----------|-------------|
| Revenue | All income for the period |
| Expenses | All costs for the period |
| Donations | Fundraising campaign income |
| Sponsorships | Corporate sponsor income |

Reports include:
- Trend vs. previous period
- Revenue breakdown by team (with progress bars)
- Net income calculation
- PDF export capability

---

### Integrations Hub (`/integrations`)

Though listed as its own module in the sidebar, Integrations is part of the org-level infrastructure. It manages connections to:

| Platform | Purpose |
|----------|---------|
| GameChanger | Live stats, roster sync |
| Band | Team communications |
| NCS Fastpitch | Tournament registration |
| Social Media | Instagram, Twitter, YouTube, TikTok |
| Video Highlights | Clip editing and distribution |
| Branding | White-label templates |

See [Integrations Guide](integrations-guide.md) for full documentation.

---

## Dashboard Summary Card

The Rally-Org dashboard (`/org`) displays a three-panel summary at the top of the page:

### Team Stats Panel
- Total record across all teams (W–L–T)
- Total games played
- Total registered players

### Fundraising Panel
- Total raised across all active campaigns
- Organization fundraising goal
- Number of active campaigns

### Coach AI Panel
- Total practice plans generated
- Total drills in the library
- Total AI chat threads

This gives admins an instant read on organizational health without drilling into any individual module.

---

## Data Model

Rally-Org operates on these Prisma models (see [Data Model](../rallyiq/data-model.md) for full field reference):

| Model | Purpose |
|-------|---------|
| Organization | Root entity — all org data belongs here |
| Team | Individual teams — summarized in /org/teams |
| Sponsor | Corporate sponsors — managed in /org/sponsors |
| DonationCampaign | Fundraising campaigns — summarized in /org |
| FinancialReport | Quarterly P&L reports — full detail in /org/financials |
| IntegrationConfig | Platform connection settings — managed in /integrations |
| BrandingTemplate | White-label design templates |

---

## Navigation

Rally-Org is accessible from the sidebar under **Org**:

```
Org
├── Overview (/org)
├── Teams (/org/teams)
├── Sponsors (/org/sponsors)
└── Financials (/org/financials)
```

Integrations, while org-scoped, appears as its own top-level sidebar section due to its size:

```
Integrations
├── Hub (/integrations)
├── Band (/integrations/band)
├── GameChanger (/integrations/gamechanger)
├── NCS (/integrations/ncs)
├── Social (/integrations/social)
├── Video Highlights (/integrations/video-highlights)
└── Branding (/integrations/branding)
```

---

## Relationship to RallyIQ

Rally-Org is not a separate application — it is the admin layer of RallyIQ. The same codebase, database, and authentication system serves all roles. The distinction is purely in what each role can see and do:

```
RallyIQ Platform
├── Coach module     → Coach role
├── Teams module     → Coach role
├── Profiles module  → Coach + Player roles
├── Fundraise module → Coach + Admin roles
├── Scout module     → Coach role
├── Org module       → Admin role only   ← Rally-Org
└── Integrations     → Admin role        ← Rally-Org
```

When we refer to "Rally-Org," we mean the combination of the Org module and the Integrations module — the portions of RallyIQ that are scoped to organizational administration rather than individual team management.
