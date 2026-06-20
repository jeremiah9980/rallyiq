# RallyIQ Portals

RallyIQ includes three public-facing portals — one each for coaches, players, and parents. Portals are lightweight, role-optimized views designed for quick daily use without navigating the full dashboard.

---

## Overview

| Portal | URL | Audience | Auth Required |
|--------|-----|----------|---------------|
| Coach Portal | `/portals/coach` | Coaches | No (public demo view) |
| Player Portal | `/portals/player` | Athletes | No (public demo view) |
| Parent Portal | `/portals/parent` | Parents/Guardians | No (public demo view) |

> The portals in the current implementation are demo/preview views with sample data. In production, they would be authenticated and display data for the specific logged-in user.

---

## Coach Portal

**URL:** `/portals/coach`

Designed for coaches who want a quick-start view without loading the full dashboard. Prioritizes today's practice and recent player notes.

### What's Displayed

**Header:**
- Personalized greeting ("Good morning, Coach Rivera")
- Current date

**Quick Stats Row:**
- My Teams — number of teams coached
- My Players — total player count
- This Week — events scheduled this week
- Notes Today — notes written today

**Today's Practice Card:**
- Practice title and date
- Location
- Drill list for the session (name, duration, player count per drill)

**Quick Note Form:**
- Select a player from dropdown
- Enter a note
- One-click save to player notes

### Use Case

Coaches check this portal before arriving at practice. It shows exactly what's needed for the session without any navigation. Notes can be added on a phone between drills.

---

## Player Portal

**URL:** `/portals/player`

A personal dashboard for each athlete. Shows their stats, schedule, development feedback, and highlight videos.

### What's Displayed

**Player Hero Section:**
- Name and jersey number
- Overall coach rating (e.g. 8.5/10)
- Key season stats: Batting AVG, RBI, HR, Games Played

**My Schedule:**
- Upcoming events (games and practices)
- Date, time, and location for each

**Development Section:**
- Latest coach note (category + content)
- Skill progress bars:
  - Hitting Mechanics
  - Fielding
  - Baserunning
  - Pitching (if applicable)

**My Highlights:**
- Grid of saved video clips
- Thumbnail, title, duration, view count for each
- Play button to view

### Use Case

Players check this portal to see their upcoming schedule, review coach feedback, and share highlight clips with recruiting contacts. Parents often share the highlights grid link with college coaches.

---

## Parent Portal

**URL:** `/portals/parent`

Designed for family members who want to stay informed without needing access to coaching tools. Focuses on schedule, communications, and fundraising.

### What's Displayed

**Welcome Header:**
- Personalized greeting with parent's name

**Your Athlete Card:**
- Player name, position
- Current GPA
- Games played this season
- Team name

**Upcoming Events:**
- List of next 3–5 events (games, practices, tournaments)
- Date, time, location, and event type
- Game opponent when applicable

**Messages:**
- Recent communications from coaches and admins
- Subject, sender, and date
- Unread indicator

**Fundraising CTA:**
- Active campaign name and progress bar
- Amount raised vs. goal
- Days remaining
- **Donate Now** button

### Use Case

Parents visit this portal to check the week's schedule, read coach announcements, and participate in fundraising. It surfaces only what families need — no coaching or roster management tools.

---

## Customizing Portals

### Showing Real Data

To connect portals to live database data, update each portal page to:

1. Add a session check with `getServerSession`
2. Fetch user-specific data via Prisma
3. Replace the hardcoded sample objects with database records

**Example — Player Portal with real data:**

```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function PlayerPortal() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const player = await prisma.player.findFirst({
    where: { user: { email: session.user.email } },
    include: {
      user: true,
      team: { include: { schedules: true } },
      athleteProfile: { include: { videoHighlights: true } },
      playerNotes: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  if (!player) redirect('/login')

  return <PlayerPortalView player={player} />
}
```

### Role-Based Redirects

To enforce role-based portal access, add this to each portal layout:

```tsx
const session = await getServerSession(authOptions)
const role = (session?.user as { role?: string })?.role

if (role !== 'coach') redirect('/dashboard')
```

### Branding

Portal pages inherit the organization's `primaryColor` from `BrandingTemplate`. To apply org branding:

1. Fetch the `BrandingTemplate` for the current organization
2. Set CSS custom properties in the portal layout
3. Use `style={{ '--color-primary': template.primaryColor }}` on the root element

---

## Portal vs Dashboard Comparison

| Capability | Portals | Dashboard |
|-----------|---------|-----------|
| View schedule | Yes | Yes |
| Add/edit events | No | Yes |
| View player notes | Player only | All players |
| Create notes | No | Yes |
| View fundraising | Parent (donate only) | Full management |
| Access AI features | No | Yes |
| Manage roster | No | Yes |
| View team stats | Player (own) | All teams |
| Mobile-optimized | Yes | Partially |
| Authentication | Optional | Required |
