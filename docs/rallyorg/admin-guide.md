# Rally-Org Admin Guide

Step-by-step instructions for organization administrators. This guide covers the complete Rally-Org workflow: setting up your organization, managing teams and staff, tracking finances, and overseeing sponsors.

---

## Getting Started as an Admin

### Admin Account Requirements

To access Rally-Org features, your user account must have `role: "admin"`. If you're setting up a new installation:

1. Run the seed script to create the default admin:
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
   ```
   Credentials: `admin@rallyiq.com` / `demo123`

2. Or create your own admin via the database:
   ```sql
   UPDATE User SET role = 'admin' WHERE email = 'your@email.com';
   ```

### First Login Checklist

After logging in as admin, complete this setup sequence:

- [ ] Open **Settings** and enter your Anthropic API key (enables all AI features)
- [ ] Navigate to **Org → Teams** to review your team list
- [ ] Navigate to **Org → Sponsors** to add your sponsors
- [ ] Navigate to **Integrations** to connect external platforms
- [ ] Set up at least one **DonationCampaign** in **Fundraise**

---

## Organization Dashboard (`/org`)

The org dashboard gives an at-a-glance view of your entire club's health across three panels.

### Reading the Team Stats Panel

| Metric | What It Tells You |
|--------|------------------|
| Record (W–L–T) | Combined win/loss across all teams |
| Games Played | Total games logged across the org |
| Total Players | All registered athletes in the org |

If Games Played is 0, no coaches have started logging game results yet — prompt them to use the Season Tracker in Teams.

### Reading the Fundraising Panel

| Metric | What It Tells You |
|--------|------------------|
| Total Raised | Sum of all campaign `raised` fields |
| Goal | Org-level fundraising target |
| Active Campaigns | How many campaigns are currently `active: true` |

If no campaigns are showing, create one in **Fundraise → Campaigns**.

### Reading the Coach AI Panel

| Metric | What It Tells You |
|--------|------------------|
| Practice Plans | AI-generated plans saved by coaches |
| Drills | Drill guides in the library |
| Chat Threads | Coaching AI conversations started |

Low numbers here indicate coaches haven't discovered AI features — consider a short training session.

---

## Managing Teams (`/org/teams`)

### Reading the Teams Table

The teams table shows every team in your organization with:

| Column | Description |
|--------|-------------|
| Team | Team name |
| Age Group | Assigned age division (10U, 12U, etc.) |
| Players | Current roster size |
| Record | Season win–loss–tie |
| Coach | Assigned head coach name |
| Budget | Total allocated budget |
| Spent | Amount spent to date |
| Status | Active or Inactive |

**Color indicators:**
- Green record = winning season (more wins than losses)
- Red record = losing season
- Budget "Spent" column turns red if overspent (Spent > Budget)

### Adding a New Team

Teams are added via the API or directly through the database. From the admin panel:

1. Use the **Prisma Studio** database browser:
   ```bash
   npx prisma studio
   ```
2. Open the `Team` table
3. Click **Add record**
4. Fill in: `name`, `sport`, `ageGroup`, `season`, `organizationId`
5. Save

Or via the API:

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "name": "16U Premier",
    "sport": "softball",
    "ageGroup": "16U",
    "season": "Fall 2025",
    "organizationId": "YOUR_ORG_ID"
  }'
```

### Assigning Coaches to Teams

Coach-to-team assignments are managed through the many-to-many relation in the `Coach` model. In Prisma Studio:

1. Open the `Coach` table
2. Find the coach record
3. Click on the `teams` relation field
4. Add the team record

### Deactivating a Team

If a team's season is complete, update its status in Prisma Studio:
- Set any inactive team identifiers in the notes or name (e.g. append "[Inactive]")
- The current schema uses the `season` field to indicate period — a team is implicitly inactive when its season passes

---

## Managing Sponsors (`/org/sponsors`)

### Sponsor Tier System

RallyIQ uses four tiers to categorize sponsors by contribution level:

| Tier | Suggested Amount | Benefits |
|------|-----------------|---------|
| Platinum | $5,000+ | Premier logo placement, announcer recognition, banner at all games |
| Gold | $2,500–$4,999 | Logo on materials, social media mention |
| Silver | $1,000–$2,499 | Logo on website, newsletter mention |
| Bronze | $500–$999 | Name listed on sponsor page |

Tier amounts are guidelines — RallyIQ does not enforce them automatically.

### Adding a Sponsor

Add sponsors via Prisma Studio:

1. Open `Sponsor` table → **Add record**
2. Fill in:
   - `name` — Company name
   - `tierLevel` — `platinum`, `gold`, `silver`, or `bronze`
   - `amount` — Annual commitment in dollars
   - `contactName` — Primary contact
   - `contactEmail` — Contact email
   - `website` — Company URL
   - `logoUrl` — Image URL for their logo
   - `organizationId` — Your org ID
   - `active` — `true`

### Sponsor Renewal Tracking

RallyIQ does not currently have built-in renewal reminders. Best practice:

1. Add a note to `Sponsor.website` or use the notes field to track renewal date
2. Filter the sponsors view by `active` status each season
3. Contact inactive sponsors to discuss renewal

### Removing a Sponsor

Rather than deleting, set `active: false` to maintain donation history while hiding the sponsor from active views.

---

## Financial Reporting (`/org/financials`)

### Reading a Financial Report

Each quarterly report shows:

```
Q2 2025
┌─────────────────────────────────────────────┐
│ Revenue        $12,400   (+8% vs Q1)        │
│ Expenses        $9,800   (+3% vs Q1)        │
│ Donations       $4,200   (+12% vs Q1)       │
│ Sponsorships    $3,500   (flat vs Q1)       │
│ Net Income      $2,600                      │
└─────────────────────────────────────────────┘
```

**Revenue by Team** section shows a breakdown with progress bars indicating each team's share of total revenue.

### Creating a Financial Report

Financial reports are created manually at the end of each quarter. Add via Prisma Studio:

1. Open `FinancialReport` table → **Add record**
2. Fill in:
   - `period` — e.g. "Q2 2025"
   - `revenue` — Total revenue for the quarter
   - `expenses` — Total expenses
   - `donations` — Fundraising income
   - `sponsorships` — Sponsor income
   - `notes` — Any additional commentary
   - `organizationId` — Your org ID

### Exporting Reports

The financials page includes a **Export PDF** button that prints the current report view as a PDF. Use your browser's print dialog to save as PDF.

### Recommended Quarterly Process

At the end of each quarter:

1. Pull totals from your payment processor, bank account, and donation platform
2. Create a new `FinancialReport` record with the period totals
3. Review the revenue-by-team breakdown to identify over/under-performing teams
4. Share the report PDF with your board or parent board

---

## Managing Users

### Creating Coach Accounts

1. Navigate to Prisma Studio (`npx prisma studio`)
2. Open the `User` table → **Add record**
3. Fill in:
   - `email` — Coach's email
   - `name` — Full name
   - `role` — `coach`
   - `password` — bcrypt hash (generate below)
   - `organizationId` — Your org ID

Generate a bcrypt hash for the password:
```bash
node -e "const b=require('bcryptjs');b.hash('initialpassword',10).then(console.log)"
```

4. Open the `Coach` table → **Add record**
5. Set `userId` to the new User's ID
6. Share the email and initial password with the coach

### Creating Player Accounts

Follow the same steps as coach creation, but:
- Set `role` to `player`
- Create a `Player` record linked to the User
- Optionally create an `AthleteProfile` linked to the Player

### Changing a User's Role

In Prisma Studio, open the `User` table, find the user, and update the `role` field.

### Resetting a Password

Generate a new bcrypt hash and update the `password` field in the `User` table:

```bash
node -e "const b=require('bcryptjs');b.hash('newpassword',10).then(console.log)"
```

---

## Organization Settings

### Updating Org Name and Branding

In Prisma Studio:
1. Open `Organization` table
2. Edit `name`, `logoUrl`, `primaryColor`, `sport`

### Managing Branding Templates

Branding templates control white-label appearance. Create one via Prisma Studio:
1. Open `BrandingTemplate` table → **Add record**
2. Fill in: `name`, `primaryColor`, `secondaryColor`, `fontFamily`, `logoUrl`, `organizationId`
3. Set `templateData` to a JSON string with any additional design config

---

## Admin Checklist — Seasonal Setup

At the start of each season:

- [ ] Create new teams for the season (update `season` field on existing or add new records)
- [ ] Assign coaches to teams
- [ ] Import player rosters (via Prisma Studio or API)
- [ ] Create athlete profiles for new players
- [ ] Set up donation campaigns for the season
- [ ] Confirm sponsor renewals and update inactive sponsors
- [ ] Connect integrations (GameChanger, Band, NCS) for new season teams
- [ ] Create a Q1 financial report baseline

At the end of each season:

- [ ] Create a final quarterly financial report
- [ ] Export and archive financial reports as PDFs
- [ ] Mark inactive teams or update season fields
- [ ] Document any sponsor changes (new, renewed, lapsed)
- [ ] Review tryout candidates for next season roster decisions
- [ ] Export player highlight videos and recruiting snapshots for graduating athletes
