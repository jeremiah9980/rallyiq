# How to Add a New Team in Rally-Org

Follow these steps to fully set up a new team inside your RallyIQ organization — from creating the team record to having coaches and players ready to go.

---

## Before You Start

You need:
- Admin access to RallyIQ (`admin@rallyiq.com` or your admin account)
- The app running locally (`npm run dev`) or deployed to your server
- Prisma Studio open in a second tab for database edits:
  ```bash
  npx prisma studio
  ```
  Then open [http://localhost:5555](http://localhost:5555)

---

## Step 1 — Create the Team Record

1. In Prisma Studio, open the **Team** table
2. Click **Add record**
3. Fill in these fields:

   | Field | Example | Notes |
   |-------|---------|-------|
   | `name` | `14U Premier Gold` | Team display name |
   | `sport` | `softball` | softball, baseball, soccer, etc. |
   | `ageGroup` | `14U` | 8U, 10U, 12U, 14U, 16U, 18U |
   | `season` | `Fall 2025` | Season label |
   | `organizationId` | *(your org ID)* | Copy from the Organization table |

4. Click **Save**
5. Copy the new team's `id` — you'll need it in later steps

---

## Step 2 — Create the Coach's User Account

1. In Prisma Studio, open the **User** table
2. Click **Add record**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | `name` | Coach's full name |
   | `email` | Coach's email address |
   | `role` | `coach` |
   | `password` | bcrypt hash of their initial password |
   | `organizationId` | Your org ID |

4. **Generate the password hash** — run this in your terminal:
   ```bash
   node -e "const b=require('bcryptjs'); b.hash('Welcome2025!', 10).then(console.log)"
   ```
   Copy the output (starts with `$2a$`) and paste it as the `password` value.

5. Click **Save** and copy the new User's `id`

---

## Step 3 — Create the Coach Profile

1. In Prisma Studio, open the **Coach** table
2. Click **Add record**
3. Fill in:

   | Field | Value |
   |-------|-------|
   | `userId` | The User ID from Step 2 |
   | `bio` | Optional — coach background |
   | `specialties` | Optional — e.g. `hitting, baserunning` |

4. Click **Save** and copy the Coach `id`

---

## Step 4 — Link the Coach to the Team

The Coach–Team relationship is a many-to-many. To connect them:

1. In Prisma Studio, open the **Team** table
2. Find your new team
3. Click the `coaches` relation field
4. Click **Add existing record**
5. Select the coach you just created
6. Save

The coach can now see this team in their dashboard.

---

## Step 5 — Add Players to the Roster

Repeat for each player on the team.

### 5a — Create the Player's User Account

In the **User** table, add a record:

| Field | Value |
|-------|-------|
| `name` | Player's full name |
| `email` | Player's email (or parent email) |
| `role` | `player` |
| `password` | bcrypt hash (same method as Step 2) |
| `organizationId` | Your org ID |

### 5b — Create the Player Profile

In the **Player** table, add a record:

| Field | Value |
|-------|-------|
| `userId` | Player's User ID |
| `number` | Jersey number |
| `position` | SS, P, C, 1B, OF, etc. |
| `grade` | 8th, 9th, 10th, etc. |
| `gpa` | Optional |
| `height` | Optional — e.g. `5'4"` |
| `weight` | Optional |
| `teamId` | The team ID from Step 1 |

### 5c — Create an Athlete Profile (Optional)

In the **AthleteProfile** table, add a record:

| Field | Value |
|-------|-------|
| `playerId` | Player ID from 5b |
| `bio` | Short bio |
| `graduationYear` | e.g. `2028` |
| `collegeInterest` | e.g. `Division I Softball` |

---

## Step 6 — Create the Season Schedule

1. Log in to RallyIQ as the coach at [http://localhost:3000/login](http://localhost:3000/login)
2. Go to **Teams → [Your New Team] → Schedule**
3. Click **Add Event** for each game, practice, or tournament:

   | Field | Notes |
   |-------|-------|
   | Title | Event name or opponent |
   | Type | `game`, `practice`, `tournament`, `event` |
   | Date & Time | When it happens |
   | Location | Field or venue |

---

## Step 7 — Set Up the Team's First Practice

1. Go to **Coach AI → Practice Planner**
2. Fill in the planning form for this team:
   - Age Group, Duration, Player Count, Focus Area
3. Click **Generate Practice Plan**
4. Click **Save Plan** to add it to the library

---

## Step 8 — Add the Team Budget (Admin)

1. Back in the **Org → Teams** view, verify your new team appears in the table
2. Update the budget in Prisma Studio — open the **Team** table
   > Note: The budget fields (`budget`, `spent`) are displayed in the Org Teams view from static/computed data in the current version. To add real budget tracking, store it in a note field or extend the schema with `budget Float` and `spent Float` fields on the Team model.

---

## Step 9 — Set Up Communications

1. Go to **Teams → [Your New Team] → Communications**
2. Send a welcome message to all team members:
   - Type: **Email** or **Push**
   - Recipients: **All members**
   - Subject: `Welcome to [Team Name] — Season Kickoff`
   - Body: Include schedule link, practice dates, and coach contact info

---

## Step 10 — Send Coach Login Credentials

Send the coach their login details:

```
Welcome to RallyIQ!

Your team [14U Premier Gold] has been set up.

Login: https://your-domain.com/login
Email: coach@example.com
Password: Welcome2025!

Please change your password after first login.
```

Send the same to each player/parent.

---

## Checklist

| Step | Task | Done |
|------|------|------|
| 1 | Team record created | ☐ |
| 2 | Coach user account created | ☐ |
| 3 | Coach profile created | ☐ |
| 4 | Coach linked to team | ☐ |
| 5 | All players added (User + Player records) | ☐ |
| 6 | Season schedule entered | ☐ |
| 7 | First practice plan generated | ☐ |
| 8 | Team budget noted | ☐ |
| 9 | Welcome communication sent | ☐ |
| 10 | Login credentials sent to coach and players | ☐ |

---

## Quick Reference — Key IDs to Track

Write these down as you work through the steps:

| Item | ID |
|------|----|
| Organization ID | |
| New Team ID | |
| Coach User ID | |
| Coach Profile ID | |

You'll use these IDs when linking records across tables.

---

## Troubleshooting

**Coach can't see the team after login**
- Confirm the Coach record's `userId` matches the User account
- Confirm the Team record has the Coach in its `coaches` relation
- Try logging out and back in to refresh the session

**Player doesn't appear on roster**
- Confirm the Player record's `teamId` matches the team
- Confirm the Player's `userId` points to an existing User

**Password isn't working**
- Regenerate the bcrypt hash — make sure you're running the command from inside the `rallyiq` directory where `bcryptjs` is installed:
  ```bash
  node -e "const b=require('bcryptjs'); b.hash('YourPassword', 10).then(console.log)"
  ```
