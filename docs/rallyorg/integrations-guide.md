# Rally-Org Integrations Guide

RallyIQ connects to six external platforms through the Integrations Hub. This guide covers setup, daily use, and troubleshooting for each integration.

---

## Integrations Hub (`/integrations`)

The Hub is the central command center for all external platform connections. It provides:

- **Status overview** — which platforms are connected vs. disconnected
- **Activity feed** — recent events across all connected platforms
- **AI Briefing** — one-click summary of cross-platform action items
- **Quick actions** — direct links to the most common tasks for each platform

---

## Configuring an Integration

All integration settings are stored in the `IntegrationConfig` model in the database.

### Via the Settings Tab

1. Go to `/integrations`
2. Click the **Settings** tab
3. Toggle the platform on or off
4. Configure platform-specific options (API keys, team IDs)
5. Changes are saved to the `IntegrationConfig` record for your organization

### Via Prisma Studio

For initial setup or credential rotation:

1. Open Prisma Studio: `npx prisma studio`
2. Open the `IntegrationConfig` table
3. Find or create a record for your organization
4. Set `service` to the platform name
5. Set `config` to a JSON string with credentials:
   ```json
   {"apiKey": "your-api-key", "teamId": "your-team-id"}
   ```
6. Set `enabled: true`

---

## GameChanger Integration

**Tab:** `/integrations` → GameChanger tab · **Location:** `/integrations/gamechanger`

GameChanger is the most widely used stats and scorekeeping platform in youth baseball and softball.

> **No public API:** Like NCS Fastpitch, GameChanger does not publish a developer API for arbitrary teams. RallyIQ's GameChanger integration verifies access to your team's GameChanger page, then uses a **manual paste-and-parse** workflow — the same pattern as the NCS integration — to cross-reference your roster and pull in stats.

### What RallyIQ Does with GameChanger

| Feature | Description |
|---------|------------|
| Verify Team Access | Paste your team's `web.gc.com` URL; RallyIQ validates the link format, extracts the team ID, and opens the team page so you can confirm access |
| Roster Cross-Reference | Paste the GameChanger roster table; RallyIQ matches each row to a player on your RallyIQ roster by name (falling back to jersey number) and saves their GameChanger player ID |
| Stat Import | Paste a box score from a completed game; RallyIQ matches each stat line to a player (by GameChanger ID, then name, then jersey) and adds it to the Season Tracker |
| Portal Updates | Once imported, stats flow through the same `games`/`players` data used by Roster, Athlete Profiles, and anywhere season stats are displayed — no separate sync step needed |

### Step 1 — Verify Team Access

**Location:** `/integrations/gamechanger`

1. Paste your team's GameChanger URL, e.g. `https://web.gc.com/teams/<teamId>/<season-slug>`
2. Click **Verify & Open Team**. RallyIQ checks the URL matches the `web.gc.com/teams/...` pattern, extracts the team ID, opens the page in a new tab, and marks the integration **Access Verified**

### Step 2 — Cross-Reference Roster & Collect GameChanger IDs

1. On the GameChanger team roster page, select and copy the roster table
2. Paste it into the **Step 2** textarea and click **Parse Roster**
3. Review the match table — each row shows whether it matched a RallyIQ player by name or jersey number. Unmatched rows can be assigned manually via the dropdown
4. Enter or confirm each player's GameChanger ID, then click **Save GameChanger IDs**. Matched IDs are stored on the player record (`Player.gcId`) for future stat matching

### Step 3 — Import Game Stats

1. Enter the opponent and date for the game
2. Copy the box score / player stats table from GameChanger and paste it into the **Step 3** textarea
3. Click **Parse Stats**. Rows are matched to players using their linked GameChanger ID first, then name, then jersey number
4. Click **Import Stats to Season**. A new game is added to the team's Season Tracker with `source: 'gc'`, and stats immediately appear anywhere season stats are shown (Roster, Athlete Profiles)

### Troubleshooting

| Issue | Fix |
|-------|-----|
| "That doesn't look like a web.gc.com team URL" | Copy the URL directly from your browser's address bar while on the team's GameChanger page |
| Roster rows show "No match" | The player name in GameChanger doesn't match RallyIQ exactly and has no matching jersey number — pick the player manually from the dropdown |
| Stat rows show "No match" | Link the player's GameChanger ID in Step 2 first, or make sure the name/jersey in the pasted box score matches your roster |
| Stats not appearing on Roster/Profiles | Confirm the import succeeded (a toast confirms how many player lines were imported) — both pages read live from the same season data |

---

## Band Integration

**Tab:** `/integrations` → Band tab

Band is the most popular private team communication platform for youth sports. Most teams use it as their primary parent-coach communication channel.

### What RallyIQ Connects to Band

| Feature | Description |
|---------|------------|
| Message Composer | Write team announcements in RallyIQ and post to Band |
| Templates | Pre-written messages for common situations |
| AI Compose | Generate Band-optimized messages with AI |

### Setup

1. Log in to [band.us](https://band.us)
2. Go to your team's Band → **Settings** → **API / Integrations** (if available)
3. Copy your Band API key and group ID
4. In RallyIQ Settings, enter `BAND_API_KEY` and `BAND_GROUP_ID`
5. Toggle Band to **Enabled**

### Sending a Message

From the **Band** tab:

1. Click a template button for quick-fill:
   - **Practice Reminder** — fills a standard practice reminder
   - **Game Result** — fills a score announcement
   - **Schedule Change** — fills a cancellation or change notice
   - **General Announcement** — blank template
2. Edit the message content
3. Click **Post to Band**

### Using the AI Composer

From the **Composer** tab:

1. Select **Band** as the target platform
2. Choose a message type (Announcement, Reminder, Update, Alert)
3. Click **Generate AI Message**
4. Review and edit the generated text
5. Click **Send via Band**

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Messages not posting | Verify Band API key and group ID |
| Wrong group receiving messages | Confirm `BAND_GROUP_ID` matches the correct team group |

---

## NCS Fastpitch Integration

**Tab:** `/integrations` → NCS tab

NCS Fastpitch is one of the largest sanctioning bodies for travel softball tournaments. The integration helps teams discover tournaments and import their roster.

> **No public API:** NCS Fastpitch does not publish a developer API or API keys. RallyIQ instead reads the public NCS portal ([playncs.com](https://www.playncs.com/fastpitch)) directly — you search for your team by name and RallyIQ pulls the roster off the team's NCS page automatically. A manual copy/paste fallback is still available if a team can't be found.

### What RallyIQ Does with NCS

| Feature | Description |
|---------|------------|
| Search NCS | Searches the public NCS portal by team name, state, and season and lists matching teams (with division, location, and W-L-T record) |
| One-click Roster Import | Pulls the selected team's roster (player names and jersey numbers) straight off its NCS page — no copy/paste |
| Manual Paste Fallback | If a team can't be found, paste the roster table and RallyIQ parses names, jersey numbers, positions, bats/throws, and grad year |
| Preview & Edit | Review and correct parsed rows before anything is saved |
| Import to Roster | Adds new players to your team roster, skipping any names that already exist |

### Importing a Roster from NCS

**Location:** `/integrations/ncs`

1. **Step 1 — Search the NCS portal.** Type your team name (optionally pick a state and season) and click **Search NCS**. RallyIQ queries the public NCS portal and lists matching teams with their division, location, and record.
2. **Step 2 — Pick your team.** Find your team in the results and click **Import Roster**. RallyIQ fetches that team's roster directly from its NCS page. Each team name links to the team's NCS page if you want to verify it first.
3. **Step 3 — Review.** A preview table appears with every parsed field editable. NCS rosters provide each player's name and jersey number; fill in position, bats/throws, and grad year as desired, or click the trash icon to drop a row you don't want imported.
4. Click **Import N Players to Roster**. New players are added to your team roster (`Teams → Roster`). Players whose name already matches someone on your roster are skipped automatically to avoid duplicates.

#### Manual Paste Fallback

If your team doesn't appear in NCS search, click **Can't find your team? Paste the roster table manually** to paste a roster table copied from any source. RallyIQ parses it the same way and feeds it into the Step 3 review table.

- If the pasted text has a header row (e.g. `Name`, `Jersey`, `Pos`, `Bats`, `Throws`, `Grad`), RallyIQ uses those column labels to map fields.
- If there's no header, RallyIQ falls back to heuristics: a 1–3 digit number is treated as the jersey, a recognized position code (`P`, `C`, `1B`, `SS`, `OF`, etc.) is treated as position, a 4-digit year starting with `20` is treated as grad year, and whatever remains is treated as the player's name.
- Always check the preview table before importing.

---

## Social Media Integrations

**Tab:** `/integrations/social`

RallyIQ supports connecting to four social platforms for distributing team content.

| Platform | Primary Use |
|----------|------------|
| Instagram | Photo posts, highlight reels, stories |
| Twitter/X | Game scores, quick updates, announcements |
| YouTube | Full highlight videos, season recaps |
| TikTok | Short-form player highlights |

### Setup (per platform)

Each platform requires OAuth authorization:

1. Go to **Integrations → Social**
2. Click **Connect** next to the platform
3. Log in with your team's social account
4. Authorize RallyIQ to post on your behalf
5. The platform shows as **Connected**

### What You Can Post

From **Integrations → Composer**:

- Select social platforms as additional targets alongside Band/GameChanger
- Type or AI-generate your message
- Click **Send** to distribute to all selected platforms simultaneously

### Posting Video Highlights

From **Integrations → Video Highlights**:

1. Select a player's highlight clip from the library
2. Choose destination platforms (Instagram, TikTok, YouTube)
3. Add a caption (or generate one with AI)
4. Click **Post**

---

## Video Highlights Integration

**Tab:** `/integrations/video-highlights`

The video highlights integration connects athlete highlight clips (stored in `VideoHighlight` and `VideoClip` models) with social distribution.

### Workflow

```
Player records → Coach selects clips → RallyIQ stores in VideoHighlight → Admin distributes via Social
```

### Features

- Browse all athlete highlight clips across the org
- Edit clip metadata (title, tags, description)
- Select clips for social distribution
- Generate AI captions for social posts
- Track view counts and engagement

---

## Branding Integration

**Tab:** `/integrations/branding`

The branding module manages white-label design templates for organizations on the Org plan.

### What Branding Controls

| Element | Description |
|---------|------------|
| Primary Color | Main brand color (hex) |
| Secondary Color | Accent color (hex) |
| Logo | Organization logo (URL) |
| Font Family | Typography |
| Template Data | Full JSON design configuration |

### Creating a Branding Template

1. Go to **Integrations → Branding**
2. Click **New Template**
3. Enter: template name, primary color, secondary color, font, logo URL
4. Click **Save**
5. Click **Apply** to set it as the active template

### Where Branding Applies

- Portals (`/portals/coach`, `/portals/player`, `/portals/parent`)
- Email communications sent through the platform
- Exported documents (practice plans, tournament itineraries)
- Public-facing athlete profiles (when sharing recruiting snapshots)

---

## Auto-Sync Settings

From the **Settings** tab in Integrations, toggle the following:

| Setting | What It Does |
|---------|-------------|
| Auto Sync | Pulls updates from connected platforms on a schedule |
| Push Notifications | Sends alerts to coaches when data updates |
| Roster Change Alerts | Notifies admin when a roster change is detected in an external platform |
| Auto Backup | Syncs data to a backup store on schedule |

> **Note:** Auto-sync requires a configured background job or cron service. In the current implementation, these toggles store the preference in `IntegrationConfig.config` but do not start background workers automatically. To enable true auto-sync, deploy a cron job or use a service like Vercel Cron.

---

## Roster Sync Tab

The **Roster Sync** tab shows all players and their sync status across connected platforms.

| Indicator | Meaning |
|-----------|---------|
| ✅ | Player exists and matches in this platform |
| ⚠️ | Player found but with differences (name, number) |
| ❌ | Player not found in this platform |
| — | Platform not connected |

Click **Sync All Players** to push RallyIQ's roster to all connected platforms and pull updates back.

---

## Troubleshooting

### Integration Shows "Disconnected" After Setup

1. Check that `enabled: true` is set in the `IntegrationConfig` record
2. Verify credentials are correct (API keys, team IDs)
3. Test credentials directly against the platform's API documentation
4. Re-enter credentials in Settings and save

### AI Briefing Shows No Data

The Hub Briefing reads from the activity log. If no integrations have synced recently, the briefing has nothing to summarize. Trigger a manual sync on each platform tab and try again.

### Messages Not Reaching Band

Band's API access varies by account tier. If posting fails:
1. Confirm your Band plan includes API access
2. Check that the group ID corresponds to the correct team
3. Try posting a test message from the Band API console directly
