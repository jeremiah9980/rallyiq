# Rally-Org Financial Reporting

Complete guide to tracking, reporting, and analyzing your organization's finances in RallyIQ.

---

## Overview

Rally-Org's financial module gives club directors and administrators a quarterly view of their organization's financial health. It consolidates four revenue streams — general revenue, expenses, donation campaigns, and corporate sponsorships — into a single reporting dashboard.

**Location:** `/org/financials`

---

## Financial Report Structure

Each report covers one fiscal period (typically a quarter) and contains:

| Field | Type | Description |
|-------|------|-------------|
| Period | String | e.g. "Q1 2025", "Spring 2025", "FY 2025" |
| Revenue | Float | Total income for the period |
| Expenses | Float | Total costs for the period |
| Donations | Float | Income from fundraising campaigns |
| Sponsorships | Float | Income from corporate sponsors |
| Notes | String | Narrative commentary |
| Net Income | Calculated | Revenue − Expenses |

---

## Financial Dashboard Layout

### Summary Stat Cards (Top Row)

Four cards display the most recent period's key figures:

| Card | Metric | Trend |
|------|--------|-------|
| Total Revenue | Sum of all income | % change vs prior period |
| Total Expenses | Sum of all costs | % change vs prior period |
| Campaign Donations | Fundraising income | % change vs prior period |
| Sponsorship Income | Corporate income | % change vs prior period |

The trend indicator is green (improvement) or red (decline), calculated against the previous period's data.

### Revenue by Team (Middle Section)

A breakdown showing how much revenue is attributed to each team, displayed as:
- Team name
- Dollar amount for the period
- Progress bar showing share of total revenue

This helps identify which teams generate the most revenue and which may need additional financial support.

### Export

The **Export PDF** button triggers a browser print dialog. Select "Save as PDF" to archive the report.

---

## Income Streams

### 1. Registration Fees (General Revenue)

The primary income source for most clubs. This includes:
- Team registration fees charged to families
- Tournament entry fees collected
- Training camp or clinic fees

**How to track:** Add the total registration income for the period to the `revenue` field of the FinancialReport.

### 2. Donation Campaigns

Income from active fundraising campaigns. RallyIQ tracks individual donations through the `DonationCampaign` and `Donation` models. At the end of a period:

1. Sum the `raised` field across all active campaigns
2. Add this total to the `donations` field of the FinancialReport
3. This total also appears automatically on the Fundraise dashboard

**Key metrics to review each quarter:**
- Total raised vs. goal (percentage funded)
- Number of active campaigns
- Average donation size
- Top donor contributions

### 3. Corporate Sponsorships

Income from sponsors in the `Sponsor` model. The total is the sum of annual `amount` values for all `active: true` sponsors.

**Calculating quarterly sponsorship income:**
```
Quarterly Sponsorship = Sum of annual amounts / 4
```

Or if sponsors pay in lump sums, record when the payment is received.

**Tracking by tier:**
- Platinum sponsors typically pay annually in advance
- Gold/Silver sponsors may pay semi-annually
- Bronze sponsors often pay at season start

### 4. Other Revenue

Any income not in the above categories:
- Merchandise sales (uniforms, spirit wear)
- Concession stand revenue
- Rental income (renting fields/facilities)
- Grants

Add these to the general `revenue` field with a note in `notes` explaining the breakdown.

---

## Expense Categories

Track expenses in the `expenses` field, broken down in `notes` by category:

| Category | Examples |
|----------|---------|
| Field/Facility | Rental fees, maintenance, equipment |
| Uniforms | Jerseys, pants, socks, hats |
| Tournament Fees | Entry fees for tournaments |
| Travel | Hotels, transportation, meals |
| Coaching | Stipends, training certifications |
| Technology | RallyIQ subscription, GameChanger, Band |
| Insurance | Player and event liability insurance |
| Marketing | Website, social media, banners |
| Equipment | Bats, helmets, bags, pitching machines |
| Admin | Bank fees, payment processing, office |

### Budget vs. Actual Tracking

While RallyIQ doesn't have a built-in budget module, the Teams table (`/org/teams`) shows `Budget` and `Spent` per team. Use these fields to track team-level budget compliance:

- `Budget` = allocated amount for the season
- `Spent` = actual expenditures to date

The Spent column turns red when it exceeds Budget, flagging overruns immediately.

---

## Quarterly Reporting Process

### Step 1 — Gather Data (Last Week of Quarter)

Collect actual numbers from:
- Your club's bank account statements
- Payment processor reports (Stripe, Square, etc.)
- GameChanger or other stat platforms for registration totals
- DonationCampaign totals from RallyIQ Fundraise module
- Sponsor payment records

### Step 2 — Create the Report

1. Open Prisma Studio: `npx prisma studio`
2. Navigate to `FinancialReport`
3. Click **Add record**
4. Fill in all fields:
   ```
   period: "Q2 2025"
   revenue: 14500
   expenses: 11200
   donations: 4800
   sponsorships: 3500
   notes: "Strong Q2. Tournament fees up 15% due to 3 extra events. New platinum sponsor secured."
   organizationId: [your org ID]
   ```
5. Save the record

### Step 3 — Review the Dashboard

Navigate to `/org/financials`. Verify:
- Net income = Revenue − Expenses (check the math)
- Trend indicators match your expectations
- Revenue by team breakdown looks correct

### Step 4 — Export and Archive

Click **Export PDF** and save the report. Store in:
- Google Drive or Dropbox for board access
- Email to board members and team directors
- Physical filing if required by your club's bylaws

### Step 5 — Budget Review Meeting

Schedule a 30-minute budget review with team directors. Key discussion points:
- Which teams are over budget?
- Which fundraising campaigns exceeded goal?
- Which sponsors are up for renewal next quarter?
- What are the projected expenses for next quarter?

---

## Key Performance Indicators (KPIs)

Track these metrics quarterly to measure organizational financial health:

| KPI | Formula | Target |
|-----|---------|--------|
| Revenue Growth | (This Q − Prior Q) / Prior Q | > 5% |
| Expense Ratio | Expenses / Revenue | < 75% |
| Donation Rate | Donations / Total Families | > 60% |
| Sponsorship Renewal Rate | Renewed Sponsors / All Sponsors | > 80% |
| Net Income Margin | Net Income / Revenue | > 15% |
| Team Budget Compliance | Teams under budget / Total Teams | > 90% |

---

## Fundraising Financial Integration

The Fundraise module feeds directly into financial reporting. Key connections:

### Campaign → Financial Report

When you close a campaign at quarter end:
1. Note the final `raised` amount on the DonationCampaign record
2. Add this to your period's `donations` field in FinancialReport
3. Mark the campaign `active: false` if it has ended

### Donation Tracking

Individual donation records (`Donation` model) provide:
- Donor names for thank-you outreach
- Anonymous vs. named giving breakdown
- Average donation size calculation
- Top donor identification for stewardship

### Sponsor Tracking

Active sponsor records feed the Sponsorship line:
```
Quarterly Sponsorship Income = 
  SUM(Sponsor.amount WHERE active = true) / 4
```

---

## Year-End Financial Summary

At the end of each fiscal year, create a summary report by combining all four quarterly reports:

| Field | Calculation |
|-------|------------|
| Annual Revenue | Q1 + Q2 + Q3 + Q4 revenue |
| Annual Expenses | Q1 + Q2 + Q3 + Q4 expenses |
| Annual Donations | Q1 + Q2 + Q3 + Q4 donations |
| Annual Sponsorships | Q1 + Q2 + Q3 + Q4 sponsorships |
| Annual Net Income | Annual Revenue − Annual Expenses |

Create this as a FinancialReport record with `period: "FY 2025"` for a permanent annual record.

---

## Financial Permissions

Only users with `role: "admin"` can access `/org/financials`. Financial data is never shown to coaches, players, or parents through the standard UI.

If you need to share financial data with team directors who have `coach` role:
1. Export the PDF from the admin account
2. Share the PDF directly
3. Do not grant admin role unless full platform access is intended

---

## Connecting to External Accounting Software

RallyIQ does not currently integrate directly with QuickBooks, Xero, or FreshBooks. For organizations that need this:

1. Export quarterly reports as PDF from RallyIQ
2. Enter totals manually into your accounting software by category
3. Or use the RallyIQ API to pull FinancialReport data programmatically:
   ```
   GET /api/financials?organizationId=YOUR_ORG_ID
   ```
   (Requires implementing this endpoint — not included in the current API)

A future integration with QuickBooks Online or Wave is the recommended next step for organizations with complex accounting needs.
