# RallyIQ API Reference

All API routes are prefixed with `/api`. Authentication is handled by NextAuth — all endpoints require a valid session cookie unless noted otherwise.

---

## Authentication

### `GET /api/auth/[...nextauth]`
### `POST /api/auth/[...nextauth]`

NextAuth.js catch-all handler. Manages:
- Credential login (`/api/auth/callback/credentials`)
- Session retrieval (`/api/auth/session`)
- CSRF token (`/api/auth/csrf`)
- Sign out (`/api/auth/signout`)

**Login request (POST `/api/auth/callback/credentials`):**

```json
{
  "email": "admin@rallyiq.com",
  "password": "demo123"
}
```

**Session response (GET `/api/auth/session`):**

```json
{
  "user": {
    "id": "clxxx...",
    "name": "Demo Admin",
    "email": "admin@rallyiq.com",
    "role": "admin"
  },
  "expires": "2026-07-09T00:00:00.000Z"
}
```

---

## Teams

### `GET /api/teams`

Returns all teams for the current user's organization.

**Response:**

```json
[
  {
    "id": "clxxx...",
    "name": "12U Gold",
    "sport": "softball",
    "ageGroup": "12U",
    "season": "Spring 2025",
    "organizationId": "clyyy...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-06-01T00:00:00.000Z"
  }
]
```

---

### `POST /api/teams`

Create a new team.

**Request body:**

```json
{
  "name": "14U Elite",
  "sport": "softball",
  "ageGroup": "14U",
  "season": "Summer 2025",
  "organizationId": "clyyy..."
}
```

**Response:** The created team object.

---

## Players

### `GET /api/players`

Returns players. Optionally filter by team.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `teamId` | string | Filter players by team ID |

**Request:**
```
GET /api/players?teamId=clxxx...
```

**Response:**

```json
[
  {
    "id": "clzzz...",
    "number": "12",
    "position": "SS",
    "grade": "7th",
    "gpa": "3.8",
    "height": "5'4\"",
    "weight": "115",
    "teamId": "clxxx...",
    "user": {
      "name": "Emma Torres",
      "email": "emma@example.com"
    }
  }
]
```

---

## Practices

### `GET /api/practices`

Returns all practices for teams the current user coaches.

**Response:**

```json
[
  {
    "id": "clppp...",
    "title": "Infield Focus Session",
    "date": "2025-06-15T14:00:00.000Z",
    "duration": 90,
    "location": "Field 3",
    "objectives": "Improve double play turns",
    "notes": "Focus on footwork at 2B",
    "teamId": "clxxx...",
    "coachId": "clccc...",
    "createdAt": "2025-06-01T00:00:00.000Z"
  }
]
```

---

### `POST /api/practices`

Create a new practice session.

**Request body:**

```json
{
  "title": "Hitting Day",
  "date": "2025-06-20T15:00:00.000Z",
  "duration": 120,
  "location": "Batting Cages",
  "objectives": "Line drive approach, gap power",
  "notes": "Bring tee and soft toss equipment",
  "teamId": "clxxx...",
  "coachId": "clccc..."
}
```

**Response:** The created practice object.

---

## Schedules

### `GET /api/schedules`

Returns schedule entries. Filter by team.

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `teamId` | string | Filter by team ID |

**Response:**

```json
[
  {
    "id": "clsss...",
    "title": "vs. Rage Gold",
    "type": "game",
    "date": "2025-06-14T10:00:00.000Z",
    "time": "10:00 AM",
    "location": "Central Park Diamond 2",
    "opponent": "Rage Gold",
    "result": "W 8-3",
    "notes": "Home uniform",
    "teamId": "clxxx..."
  }
]
```

**Schedule types:** `game` | `practice` | `tournament` | `event`

---

## Campaigns

### `GET /api/campaigns`

Returns all donation campaigns for the current organization.

**Response:**

```json
[
  {
    "id": "clcam...",
    "title": "Tournament Travel Fund",
    "description": "Help send our team to nationals",
    "goal": 5000,
    "raised": 3200,
    "startDate": "2025-05-01T00:00:00.000Z",
    "endDate": "2025-07-31T00:00:00.000Z",
    "active": true,
    "organizationId": "clyyy...",
    "donations": [
      {
        "id": "cldon...",
        "amount": 100,
        "donorName": "Jane Smith",
        "donorEmail": "jane@example.com",
        "message": "Go team!",
        "anonymous": false,
        "createdAt": "2025-05-15T00:00:00.000Z"
      }
    ]
  }
]
```

---

### `POST /api/campaigns`

Create a new donation campaign.

**Request body:**

```json
{
  "title": "New Uniforms 2025",
  "description": "Fund new uniforms for the fall season",
  "goal": 2500,
  "startDate": "2025-07-01T00:00:00.000Z",
  "endDate": "2025-09-30T00:00:00.000Z",
  "active": true,
  "organizationId": "clyyy..."
}
```

**Response:** The created campaign object.

---

## Scout Reports

### `GET /api/scouts`

Returns all scout reports created by the current coach.

**Response:**

```json
[
  {
    "id": "clsct...",
    "subject": "Wildcats SS — strong arm, predictable pitch selection",
    "content": "Their shortstop has above-average arm strength...",
    "tags": ["infield", "wildcats", "tournament"],
    "priority": "high",
    "coachId": "clccc...",
    "createdAt": "2025-06-01T00:00:00.000Z"
  }
]
```

**Priority values:** `high` | `medium` | `low`

---

### `POST /api/scouts`

Create a new scout report.

**Request body:**

```json
{
  "subject": "Thunder 14U — power hitters",
  "content": "Top 3 in their lineup have extra-base power...",
  "tags": ["thunder", "hitting", "14U"],
  "priority": "medium",
  "coachId": "clccc..."
}
```

**Response:** The created scout report object.

---

## Integrations

### `GET /api/integrations`

Returns all integration configurations for the current organization.

**Response:**

```json
[
  {
    "id": "clint...",
    "service": "gamechanger",
    "enabled": true,
    "config": "{\"apiKey\":\"gc_xxx\",\"teamId\":\"team_123\"}",
    "lastSynced": "2025-06-09T08:00:00.000Z",
    "organizationId": "clyyy..."
  }
]
```

**Service values:** `band` | `ncs` | `gamechanger` | `instagram` | `twitter` | `youtube` | `tiktok`

---

### `PUT /api/integrations`

Update an integration configuration.

**Request body:**

```json
{
  "id": "clint...",
  "enabled": true,
  "config": {
    "apiKey": "gc_new_key",
    "teamId": "team_456"
  }
}
```

**Response:** The updated integration config object.

---

## Error Responses

All endpoints return standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — no valid session |
| `403` | Forbidden — insufficient role |
| `404` | Resource not found |
| `500` | Internal server error |

**Error response body:**

```json
{
  "error": "Unauthorized"
}
```

---

## Authentication in API Calls

All API routes require an active NextAuth session. When calling from a browser, the session cookie is sent automatically. For server-side or external calls, include the session token:

```http
Cookie: next-auth.session-token=<your-token>
```

Or use the NextAuth `getServerSession` helper within Next.js API routes:

```ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })
  // ...
}
```
