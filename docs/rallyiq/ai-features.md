# RallyIQ AI Features

RallyIQ integrates Anthropic's Claude API throughout the platform to power coaching intelligence, content generation, and organizational planning. This document covers every AI-powered feature, how it works, and how to configure it.

---

## Setup

### Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-`)

### Entering Your Key in RallyIQ

1. Open any RallyIQ dashboard page
2. Click the **Settings** icon in the header
3. Paste your API key in the **Anthropic API Key** field
4. Click **Save**

The header border turns **green** when a valid key is stored. The key is saved to `localStorage` under the `rallyiq_store` key — it is not sent to any server, only used directly in browser-to-Anthropic API calls.

> **Note:** Direct browser API access requires the `anthropic-dangerous-direct-browser-access: true` header, which RallyIQ sends automatically. This is appropriate for single-user or controlled environments. For multi-tenant production use, proxy the API calls through a server-side route.

---

## Model

All AI features use:

```
claude-sonnet-4-20250514
```

Configured in `src/hooks/useStream.ts`. To change the model, update the `model` field in the `useStream` hook.

---

## Streaming Architecture

RallyIQ uses real-time streaming for all AI features. Text appears word-by-word as the model generates it, rather than waiting for the full response.

**How it works (`src/hooks/useStream.ts`):**

```ts
useStream({
  apiKey: string,
  system?: string,         // System prompt (sets the AI's role)
  messages: Message[],     // Conversation history
  maxTokens?: number,      // Default: 2048
  onText: (chunk) => void, // Called with each streamed chunk
  onDone: () => void,      // Called when stream completes
  onError: (err) => void,  // Called on error
})
```

Internally, this makes a `POST` request to `https://api.anthropic.com/v1/messages` with `stream: true` and parses Server-Sent Events (SSE) line-by-line.

---

## AI Features by Module

---

### 1. Coach AI Chat

**Location:** `/coach`

**What it does:** An open-ended AI coaching assistant trained as a knowledgeable travel softball coach and player development expert.

**System prompt:**
> You are a knowledgeable travel softball coach and player development expert. Help coaches with practice planning, game strategy, player development, and team management.

**How to use:**
- Type any coaching question in the chat input
- The AI streams a response in real time
- Continue the conversation — context is maintained within a thread
- Past threads are saved and accessible from the thread sidebar

**Example prompts:**
- "How do I teach a 12U pitcher to throw a changeup?"
- "What's the best defensive alignment against a left-handed pull hitter?"
- "Give me 3 mental toughness drills for a team that struggles after errors"
- "How should I structure a 90-minute practice for 8 players with 2 coaches?"

---

### 2. Practice Planner

**Location:** `/coach/practices`

**What it does:** Generates complete, structured practice plans in two simultaneous versions — one for coaches, one for players.

**Inputs:**
| Field | Description |
|-------|-------------|
| Age Group | 8U, 10U, 12U, 14U, 16U, 18U |
| Duration | Practice length in minutes |
| Player Count | Number of athletes expected |
| Focus Area | e.g. "hitting mechanics", "base running", "pitching" |
| Assistant Coaches | Number of additional coaches available |
| Additional Context | Any special notes or constraints |

**Output — Coach Version:**
- Detailed drill assignments per station
- Coaching cues and technical points
- Rotation timing and player groupings
- Station setup instructions
- Suggested feedback language

**Output — Player Version:**
- Motivational session preview written directly to athletes
- What to expect and prepare for
- Goal-framing for the practice
- Team-building language

**Max tokens:** 1,500 per version (3,000 total)

**System prompt:**
> You are an expert youth sports coach. Generate detailed, age-appropriate practice plans.

---

### 3. Drill Library Generator

**Location:** `/scout`

**What it does:** Generates structured, categorized drill guides on demand and saves them to a searchable library.

**Inputs:**
| Field | Options |
|-------|---------|
| Topic | Free text — e.g. "footwork for middle infielders" |
| Age Group | 8U through 18U |
| Level | Beginner, Intermediate, Advanced |
| Category | Hitting, Fielding, Pitching, Baserunning, Conditioning, Mental |

**Output:** A complete drill guide including:
- Drill name and objective
- Equipment needed
- Setup instructions
- Step-by-step execution
- Coaching cues
- Common mistakes to watch for
- Progression variations

**Saved drills** are stored in the client-side store and browsable by category.

---

### 4. Tournament Itinerary Generator

**Location:** `/teams/[teamId]/tournaments`

**What it does:** Takes tournament details (name, location, dates, games, uniforms, parking, food) and generates two comprehensive itinerary documents.

**Output — Coach View:**
- Field-by-field game logistics
- Lineup and substitution considerations
- Pre-game warmup schedule
- Equipment checklist
- Weather and field contingency notes

**Output — Parent View:**
- Family-friendly travel guide
- Meeting points and arrival times
- Food and parking information
- What to bring
- Game schedule in plain language

Both versions are rendered as formatted markdown.

---

### 5. Fundraising Plan Generator

**Location:** `/fundraise`

**What it does:** Generates a complete fundraising action plan in two versions — one for the campaign coordinator, one for families.

**Context used:** Campaign name, goal amount, team information

**Output — Coordinator Version:**
- Week-by-week campaign timeline
- Outreach strategy and communication cadence
- Donor tracking recommendations
- Follow-up sequences
- Goal milestone checkpoints

**Output — Family Version:**
- How to participate and share
- Suggested ask amounts and messaging
- Social media sharing language
- Why the campaign matters (team context)

---

### 6. Integration Hub Briefing

**Location:** `/integrations` (Hub tab)

**What it does:** Analyzes recent activity across all connected platforms (GameChanger, Band, NCS) and generates a prioritized action briefing.

**Output:** A bulleted summary of:
- Pending actions from each platform
- Upcoming deadlines or events
- Roster sync issues
- Recommended next steps

---

### 7. Multi-Platform Message Composer

**Location:** `/integrations` (Composer tab)

**What it does:** Drafts team announcements optimized for the selected platform(s).

**Inputs:**
- Message type: Announcement, Reminder, Update, Alert
- Target platforms: Band, GameChanger, NCS
- Optional context from the user

**Output:** Platform-appropriate message copy ready to send. Tone and formatting adapt to each platform's conventions.

---

## Token Usage Reference

| Feature | Estimated Tokens (output) |
|---------|--------------------------|
| Coach Chat (per reply) | 200–800 |
| Practice Planner (both versions) | ~3,000 |
| Drill Guide | ~800 |
| Tournament Itinerary (both versions) | ~2,000 |
| Fundraising Plan (both versions) | ~2,000 |
| Hub Briefing | ~400 |
| Message Composer | ~200 |

---

## Extending AI Features

### Adding a New AI Feature

1. Import `useStream` from `@/hooks/useStream`
2. Get the API key from the store: `useStore().apiKey`
3. Call `useStream` with your system prompt and messages
4. Render the streaming output

**Example:**

```tsx
import { useStream } from '@/hooks/useStream'
import { useStore } from '@/lib/store'

export function MyAIFeature() {
  const { apiKey } = useStore()
  const [output, setOutput] = useState('')

  const { stream, loading } = useStream({
    apiKey,
    system: 'You are a helpful assistant for sports coaches.',
    messages: [{ role: 'user', content: 'Generate a warm-up routine for 12U players.' }],
    onText: (chunk) => setOutput(prev => prev + chunk),
    onDone: () => console.log('Done'),
    onError: (err) => console.error(err),
  })

  return (
    <div>
      <button onClick={stream} disabled={loading}>Generate</button>
      <div>{output}</div>
    </div>
  )
}
```

### Changing the Model

Edit `src/hooks/useStream.ts`:

```ts
model: 'claude-opus-4-8',  // or any other Claude model
```

See the [Claude API docs](https://docs.anthropic.com/en/api/models) for available model IDs.

### Moving to Server-Side API Calls

For production multi-tenant deployments, move API calls server-side to protect your API key:

1. Create a Next.js API route: `src/app/api/ai/route.ts`
2. Move the Anthropic fetch call into the route handler
3. Update `useStream` to call your API route instead of Anthropic directly
4. Remove the `anthropic-dangerous-direct-browser-access` header
5. Add authentication checks to the route handler

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| `401 Unauthorized` | Invalid or missing API key | Re-enter API key in Settings |
| `429 Too Many Requests` | Rate limit exceeded | Wait and retry; consider upgrading API tier |
| `529 Overloaded` | Anthropic API overloaded | Retry with exponential backoff |
| Stream stops mid-response | Network interruption | Refresh and retry |
| No output appears | API key not set | Check Settings — header border should be green |
