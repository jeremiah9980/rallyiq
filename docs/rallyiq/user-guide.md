# RallyIQ User Guide

Step-by-step instructions for using every module in RallyIQ, organized by role.

---

## Getting Started

### Logging In

1. Navigate to `/login`
2. Enter your email and password
3. Click **Sign In**

Default demo credentials:
- Email: `admin@rallyiq.com`
- Password: `demo123`

After login you are redirected to the main dashboard.

### Dashboard Overview

The dashboard displays a summary of your organization:
- **Team Stats** — record, games played, total players
- **Fundraising** — total raised, goal, active campaigns
- **Coach AI** — practice plans created, drills generated, chat threads

The **sidebar** on the left provides navigation to all modules. The **header** shows your team name, season, theme toggle, and settings.

---

## Coach AI Module

### Practice Planner

**Path:** `/coach/practices`

The Practice Planner generates complete, structured practice plans using AI.

**To generate a practice plan:**

1. Fill in the planning form:
   - **Age Group** — e.g. 10U, 12U, 16U
   - **Duration** — total practice length in minutes
   - **Player Count** — number of athletes expected
   - **Focus Area** — e.g. hitting mechanics, base running, pitching
   - **Assistant Coaches** — how many coaches are present
   - **Additional Context** — any specific notes or constraints
2. Click **Generate Practice Plan**
3. The AI streams two versions simultaneously:
   - **Coach Version** — detailed drill assignments, coaching cues, rotation timing, station setups
   - **Player Version** — motivational prep doc written directly to the athletes
4. Use the tab to switch between versions
5. Click **Save Plan** to store it in your library
6. Click **Copy** or **Print** for offline use

**Saved Plans Library:**

All saved plans appear as cards below the form. Click a plan card to view its full content.

---

### Coach AI Chat

**Path:** `/coach`

An open-ended AI coaching assistant. Ask any coaching question: strategy, drills, player development, game situations, or practice design.

**To start a conversation:**

1. Type your question in the message input at the bottom
2. Press **Enter** or click **Send**
3. The AI responds in real time with streaming text
4. Continue the conversation — the AI maintains context within a thread

**Managing threads:**

- New conversations are saved as threads in the left sidebar
- Click a thread title to return to a previous conversation
- Each thread is titled automatically from your first message

---

### Player Notes

**Path:** `/coach/notes`

Log development notes for individual players, categorized by focus area.

**To add a note:**

1. Click **Add Note**
2. Select the player
3. Choose a category: **Technical**, **Tactical**, **Mental**, **Physical**, or **Leadership**
4. Write your note
5. Click **Save**

**Finding notes:**

- Use the search bar to filter by player name
- Use the category filter tabs to narrow by focus area
- Notes show the date, player, category badge, and full content

---

### Development Summaries

**Path:** `/coach/development`

View and create quarterly development summaries for each player.

Each summary includes:
- **Period** — e.g. Q2 2025
- **Rating** — 1–10 overall score
- **Strengths** — what the player is doing well
- **Areas to Improve** — coaching focus points
- **Goals** — targets for next period
- **Trend** — whether the rating is improving, stable, or declining

Use the **Period** and **Team** selectors to filter the view.

---

## Teams Module

### Roster Management

**Path:** `/teams/[teamId]/roster`

**Adding a player:**

1. Click **Add Player**
2. Fill in player details:
   - Name, jersey number, position
   - Bats (R/L/S), throws (R/L)
   - Graduation year
   - Parent name, parent email
3. Click **Add Player**

The player appears in both the card grid and the stats table.

**Viewing stats:**

The batting stats table shows season totals for every player:
- **G** — games played
- **AB** — at-bats
- **H** — hits
- **AVG** — batting average
- **RBI** — runs batted in
- **R** — runs scored
- **BB** — walks
- **K** — strikeouts
- **HR** — home runs

**Searching:** Use the search box to find players by name.

---

### Season Tracker (Game Log)

**Path:** `/teams/[teamId]`

Track every game result and enter per-player stats.

**Adding a game:**

1. Click **Add Game**
2. Enter: date, opponent, location, your score, their score, game type (regular/tournament/scrimmage)
3. Click **Save**
4. The result is calculated automatically (W/L/T)

**Entering player stats for a game:**

1. Click the stats icon on any game row
2. A modal opens with a row for each player
3. Enter AB, H, RBI, R, BB, K, HR for each player
4. Click **Save Stats**

**Season trend chart:**

The chart at the top of the page shows wins, losses, and run differential over time, updated as you add games.

---

### Schedule

**Path:** `/teams/[teamId]/schedule`

View all upcoming and past events for a team. Events are color-coded by type:
- **Game** — blue
- **Practice** — green
- **Tournament** — orange
- **Event** — purple

Each event shows date, time, location, opponent (if applicable), and result for completed games.

---

### Tournaments

**Path:** `/teams/[teamId]/tournaments`

Plan tournament travel and generate itineraries with AI.

**Creating a tournament:**

1. Click **New Tournament**
2. Enter: name, location, start/end dates, uniform details, parking info, food options
3. Add individual games within the tournament: day, time, opponent, field, uniform

**Generating itineraries:**

1. With a tournament created, click **Generate Itinerary**
2. The AI generates two versions:
   - **Coach View** — logistics, field assignments, lineup considerations
   - **Parent View** — family-friendly travel guide with times and meeting points
3. Switch between tabs to review each version
4. Copy or print for distribution

---

### Communications

**Path:** `/teams/[teamId]/communications`

Send messages to team members via Email, SMS, or Push notification.

**Sending a message:**

1. Click **New Message**
2. Choose type: Email, SMS, or Push
3. Select recipients: All members, Parents only, Players only
4. Write subject and body
5. Click **Send**

The activity log shows all sent communications with timestamp, type, and sender.

---

## Profiles Module

### Athlete List

**Path:** `/profiles`

Browse all athletes with search and filtering. Each card shows:
- Name, position, graduation year
- Bats/throws
- Season stats (AVG, AB, RBI, HR)
- Parent contact

Click a player card to open their full profile.

---

### Athlete Profile

**Path:** `/profiles/[playerId]`

The full athlete profile page contains:

**Hero section:**
- Name, jersey number, overall rating
- Bio and achievements
- Physical stats: grade, GPA, graduation class, height, weight, college goals

**Season stats:**
- Goals, assists, games, shots on target (shown as progress bars against targets)

**Video highlights:**
- Thumbnail grid of saved highlight clips
- Click any video to view

**Recruiting section:**
- Interested schools with contact status (Interested, Contacted, Visited, Committed)
- Contact dates and coach notes

---

### Video Highlights

**Path:** `/profiles/[playerId]/videos`

Manage video highlight clips for an athlete.

- Each clip shows: title, duration, view count, tags
- Click **Upload Video** to add a new highlight
- Click the play button to view a clip

---

### Recruiting Snapshot

**Path:** `/profiles/[playerId]/recruiting`

Track college recruiting contacts and status for each athlete.

Status levels (in order of progression):
1. **Interested** — college has expressed interest
2. **Contacted** — coach has reached out
3. **Visited** — campus visit completed
4. **Committed** — player has committed

Each school entry includes: division, contact date, notes.

---

## Fundraise Module

### Fundraise Dashboard

**Path:** `/fundraise`

Overview of all fundraising activity:
- **Total Raised** — cumulative across all campaigns
- **Goal** — current target
- **Active Campaigns** — number in progress
- **All-Time** — historical total

**Creating a fundraiser:**

1. Enter the fundraiser name and goal amount in the quick-create form
2. Click **Create**
3. The fundraiser appears in the list

**Managing a fundraiser:**

Click a fundraiser card to open the detail view:
- **Progress** — current total vs. goal
- **Record a Contribution** — enter donor name, amount, and payment method
- **Tasks** — checklist of action items with completion checkboxes
- **AI Plan** — click to generate dual-version fundraising plans (coordinator and family)
- **Status** — update to Planning, Active, or Complete

---

### Campaigns

**Path:** `/fundraise/campaigns`

Manage donation campaigns with detailed tracking.

Each campaign card shows:
- Title and description
- Progress bar (raised vs. goal)
- Number of donors
- Days remaining

Click a campaign to see the full donor list with individual amounts and messages.

---

### Sponsors

**Path:** `/fundraise/sponsors`

View and manage corporate sponsors, organized by tier:

| Tier | Color |
|------|-------|
| Platinum | Purple |
| Gold | Yellow |
| Silver | Gray |
| Bronze | Orange |

Each sponsor entry shows: name, tier, annual amount, contact name, contact email, website.

---

### Boosters

**Path:** `/fundraise/boosters`

Track major individual donors (boosters) with VIP status.

Each booster card shows:
- Total donated (all-time)
- Number of individual donations
- Teams supported
- Date of last gift
- **Send Thank You** button for outreach

---

## Scout Module

### Drill Library

**Path:** `/scout`

Generate and store AI-powered drill guides.

**Generating a drill:**

1. Enter a topic (e.g. "footwork for middle infielders")
2. Select age group (8U through 18U)
3. Select level (Beginner, Intermediate, Advanced)
4. Select category (Hitting, Fielding, Pitching, Baserunning, Conditioning, Mental)
5. Click **Generate Drill Guide**
6. Click **Save to Library** to keep it

**Browsing the library:**

Use the category filter tabs to browse saved drills. Click any drill card to view the full content with a copy option.

---

### Competitors

**Path:** `/scout/competitors`

Monitor opposing teams with threat level tracking.

Each competitor card shows:
- Team name and sport
- Win/loss record
- Threat level: **High** (red), **Medium** (yellow), **Low** (green)
- Scouting notes
- Last scouted date

Click **Add Scout Report** to log a new observation about a competitor.

---

### Roster Intel

**Path:** `/scout/roster-intel`

Store intelligence reports about opposing rosters and players.

Each report includes:
- Subject (who or what the report covers)
- Content (full scouting notes)
- Priority: High / Medium / Low
- Tags for filtering
- Author and date

---

### Tryout Pipeline

**Path:** `/scout/tryouts`

Manage tryout candidates from evaluation to decision.

**Status pipeline:**
```
Pending → Invited → Accepted
                  ↘ Rejected
```

**Adding a candidate:**

1. Click **Add Candidate**
2. Enter: name, position, age, rating (1–10), evaluation notes

**Evaluating candidates:**

- Use **Accept** or **Pass** buttons on each candidate card
- Filter the view by status using the tab bar
- The 10-point rating bar gives a visual performance snapshot

---

## Integrations Module

**Path:** `/integrations`

Central hub for connecting RallyIQ to external platforms.

### Hub Tab
- See connection status for all integrated platforms
- Click **Generate AI Briefing** to get a cross-platform summary of action items
- View recent activity log from all connected services

### GameChanger Tab
- Sync live stats from GameChanger into RallyIQ
- Preview imported roster with sync status indicators
- Click **Sync Now** to pull the latest data

### Band Tab
- Compose and send team announcements directly to your Band group
- Use template buttons for common messages:
  - Practice Reminder
  - Game Result
  - Schedule Change
  - General Announcement

### NCS Tab
- Browse local NCS Fastpitch tournaments
- View dates, locations, divisions, and registered teams
- Track registration status

### Composer Tab
- Write one message and send it to multiple platforms simultaneously
- Select destination platforms: Band, GameChanger, NCS
- Choose message type: Announcement, Reminder, Update, Alert
- Click **Generate AI Message** to draft content automatically

### Roster Sync Tab
- See sync status for each player across all connected platforms
- Indicators show whether each player is synced to GameChanger, Band, and NCS
- Click **Sync All Players** for a bulk update

### Settings Tab
- Toggle automatic sync options:
  - Auto Sync (pull updates on schedule)
  - Push Notifications
  - Roster Change Alerts
  - Auto Backup
- View connected platform credentials

---

## Settings

Click the **Settings** icon in the header to open the Settings modal.

### API Key

RallyIQ's AI features require an Anthropic API key:

1. Open Settings
2. Paste your Anthropic API key (starts with `sk-ant-`)
3. Click **Save**

The header border turns green when a valid API key is set. Without it, AI features will not work.

### Theme

Click the **sun/moon** icon in the header to toggle between light and dark mode.

### Team Name and Season

The header displays your current team name and season. These can be updated in Settings.
