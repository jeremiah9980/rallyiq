# RallyIQ

A comprehensive sports management platform for coaches, players, parents, and organizations. Built with Next.js 16, Prisma ORM, NextAuth.js, and Tailwind CSS.

---

## Platform Overview

RallyIQ is a role-based sports management system with seven core modules:

| Module | Description |
|--------|-------------|
| **Coach** | Practice planning, player notes, development tracking |
| **Teams** | Roster management, scheduling, communications, tournaments |
| **Profiles** | Athlete profiles, video highlights, recruiting snapshots |
| **Fundraise** | Donation campaigns, sponsor management, booster tracking |
| **Scout** | Competitor monitoring, roster intelligence, tryout pipeline |
| **Org** | Organization-level team and financial management |
| **Integrations** | Band, GameChanger, NCS, social media, video, branding |

### Roles
- `admin` — Full platform access
- `coach` — Coach dashboard, practices, notes, scouting
- `player` — Player profile and recruiting
- `parent` — Read-only portal access

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 18, Tailwind CSS 3, Lucide React |
| Database | Prisma ORM 5.22 (SQLite locally, PostgreSQL in prod) |
| Auth | NextAuth.js 4 (JWT + Credentials provider) |
| State | TanStack React Query 5 |
| Charts | Recharts 2 |
| AI | Anthropic Claude API (streaming via `useStream` hook) |
| Validation | Zod |

---

## Documentation

Full documentation is available in the [`docs/`](docs/index.md) directory.

| Section | Description |
|---------|-------------|
| [RallyIQ Docs](docs/rallyiq/overview.md) | Platform overview, user guide, API reference, data model, AI features, portals |
| [Rally-Org Docs](docs/rallyorg/overview.md) | Admin guide, integrations, financial reporting |
| [Installation Guides](docs/index.md) | Local, Vercel, GitHub Actions, VPS deployment |

---

## Installation Guides

Step-by-step guides for each environment:

| Guide | Description |
|-------|-------------|
| [Local Development](docs/install-local.md) | Run on your Mac, Windows, or Linux machine |
| [Vercel](docs/install-vercel.md) | Deploy to Vercel (recommended for production) |
| [GitHub Actions CI/CD](docs/install-github-actions.md) | Configure automated lint, build, and deploy |
| [VPS / Self-Hosted](docs/install-vps.md) | Deploy to EC2, DigitalOcean, Hetzner, etc. |

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/jeremiah9980/rallyiq.git
cd rallyiq
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to peer dependency constraints between Next.js 16 and some packages.

### 3. Configure Environment Variables

Copy the example env file and fill in values:

```bash
cp .env.example .env.local
```

Minimum required values for local development:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Set Up the Database

```bash
# Push the Prisma schema to the local SQLite database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Seed the demo admin user (admin@rallyiq.com / demo123)
DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Log In

Use the seeded demo credentials:

| Field | Value |
|-------|-------|
| Email | `admin@rallyiq.com` |
| Password | `demo123` |

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint on src/
npx prisma studio    # Open Prisma DB browser (port 5555)
npx prisma db push   # Sync schema to database
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db seed   # Re-run seed script
```

### Creating Additional Users

**Option A — Prisma Studio (GUI)**

```bash
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555), navigate to the `User` table, and create a record. Password must be a bcrypt hash.

**Option B — SQL**

```bash
sqlite3 prisma/dev.db
```

```sql
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  lower(hex(randomblob(16))),
  'Coach Smith',
  'coach@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- "demo123"
  'coach',
  datetime('now'),
  datetime('now')
);
```

**Option C — Extend the seed script**

Edit `prisma/seed.ts` and add more `prisma.user.upsert()` calls, then re-run:

```bash
DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
```

---

## Cloud Deployment

### Deploying to Vercel (Recommended)

Vercel is the fastest path to production for Next.js apps.

#### 1. Push to GitHub

Make sure your code is pushed to a GitHub repository.

#### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project** → **Import Git Repository**
3. Select `jeremiah9980/rallyiq`
4. Vercel auto-detects Next.js — leave framework settings as default

#### 3. Set Environment Variables in Vercel

In the Vercel project settings under **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string (see below) |
| `NEXTAUTH_SECRET` | Output of `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://rallyiq.vercel.app`) |

#### 4. Set Up a PostgreSQL Database

SQLite is for local development only. For production, use a hosted PostgreSQL provider:

- **Vercel Postgres** (Neon) — available in Vercel dashboard under Storage
- **Supabase** — [supabase.com](https://supabase.com) (free tier available)
- **Railway** — [railway.app](https://railway.app)
- **PlanetScale** / **CockroachDB** — also compatible with Prisma

After creating a database, copy the connection string and set it as `DATABASE_URL`.

#### 5. Update Prisma Schema for PostgreSQL

In `prisma/schema.prisma`, change the provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then push the schema:

```bash
DATABASE_URL="your-postgres-url" npx prisma db push
DATABASE_URL="your-postgres-url" npx prisma db seed
```

#### 6. Deploy

Click **Deploy** in Vercel. On every subsequent push to `main`, Vercel auto-deploys.

---

### CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on every push to `main` or `claude/**` branches and on pull requests to `main`.

#### What CI Runs

| Job | Steps |
|-----|-------|
| **Lint** | ESLint on all `src/**/*.{ts,tsx}` files |
| **Build & Type Check** | `tsc --noEmit` + `next build` |

#### Required GitHub Secrets

Set these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Database URL for the build environment |
| `NEXTAUTH_SECRET` | JWT secret (any 32+ char random string) |
| `NEXTAUTH_URL` | Optional — defaults to `http://localhost:3000` in CI |

To add a secret:
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret above

#### Workflow File Reference

```yaml
# .github/workflows/ci.yml
on:
  push:
    branches: [main, "claude/**"]
  pull_request:
    branches: [main]

jobs:
  lint:        # Runs ESLint
  build:       # Runs tsc + next build
```

---

### Deploying to a VPS / Self-Hosted Server

For teams who want full control (AWS EC2, DigitalOcean, Hetzner, etc.):

#### 1. Provision a Server

Minimum recommended: 1 vCPU, 1GB RAM, Ubuntu 22.04

#### 2. Install Dependencies on Server

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2
```

#### 3. Clone and Build

```bash
git clone https://github.com/jeremiah9980/rallyiq.git
cd rallyiq
npm install --legacy-peer-deps
```

Create `/home/user/rallyiq/.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rallyiq"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
```

#### 4. Run with PM2

```bash
pm2 start npm --name "rallyiq" -- start
pm2 save
pm2 startup
```

#### 5. Set Up Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Use [Certbot](https://certbot.eff.org/) to add HTTPS:

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Project Structure

```
rallyiq/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, Register pages
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── coach/           # Practice planning, notes, development
│   │   │   ├── teams/           # Roster, schedule, comms, tournaments
│   │   │   ├── profiles/        # Athlete profiles, video, recruiting
│   │   │   ├── fundraise/       # Campaigns, sponsors, boosters
│   │   │   ├── scout/           # Competitors, roster intel, tryouts
│   │   │   ├── org/             # Org-level teams, sponsors, financials
│   │   │   └── integrations/    # Band, GameChanger, NCS, social, video
│   │   ├── api/                 # REST API routes
│   │   │   ├── auth/            # NextAuth handler
│   │   │   ├── teams/
│   │   │   ├── players/
│   │   │   ├── practices/
│   │   │   ├── schedules/
│   │   │   ├── campaigns/
│   │   │   ├── scouts/
│   │   │   └── integrations/
│   │   └── portals/             # Public coach/player/parent portals
│   ├── components/
│   │   ├── ui/                  # Button, Card, Input, Avatar, Modal, etc.
│   │   └── layout/              # Sidebar, Header
│   ├── hooks/
│   │   └── useStream.ts         # Anthropic Claude streaming hook
│   └── lib/
│       ├── auth.ts              # NextAuth config
│       ├── prisma.ts            # Prisma singleton
│       ├── store.ts             # Client-side state (localStorage)
│       ├── theme.tsx            # Dark/light mode
│       └── utils.ts             # cn(), formatCurrency(), formatDate()
├── prisma/
│   ├── schema.prisma            # 22 models
│   └── seed.ts                  # Demo user seed
└── .github/
    └── workflows/
        └── ci.yml               # Lint + Build CI
```

---

## Database Schema Overview

The Prisma schema contains 22 models across six domains:

| Domain | Models |
|--------|--------|
| Auth | User, Account, Session, VerificationToken |
| Core | Organization, Team, Coach, Player |
| Practice | Practice, PracticeNote, PlayerNote, DevelopmentSummary |
| Scheduling | Schedule, Tournament, TournamentGame |
| Communications | Communication, Message |
| Athlete | AthleteProfile, VideoHighlight, VideoClip, RecruitingSnapshot |
| Fundraising | Sponsor, DonationCampaign, Donation |
| Scouting | ScoutReport, Competitor, TryoutCandidate |
| Org & Admin | FinancialReport, IntegrationConfig, BrandingTemplate |

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `file:./prisma/dev.db` (local) or PostgreSQL URL (prod) |
| `NEXTAUTH_SECRET` | Yes | Random 32+ char string for JWT signing |
| `NEXTAUTH_URL` | Yes | Full base URL (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth provider |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth provider |
| `GAMECHANGER_API_KEY` | No | GameChanger integration |
| `NCS_API_KEY` | No | NCS integration |
| `BAND_API_KEY` | No | Band integration |
| `AWS_ACCESS_KEY_ID` | No | S3 file storage |
| `AWS_SECRET_ACCESS_KEY` | No | S3 file storage |
| `AWS_S3_BUCKET` | No | S3 bucket name |
| `AWS_REGION` | No | S3 region |
| `SMTP_HOST` | No | Email notifications |
| `SMTP_PORT` | No | Email notifications |
| `SMTP_USER` | No | Email notifications |
| `SMTP_PASS` | No | Email notifications |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request against `main`

CI will automatically run lint and build checks on your PR.
