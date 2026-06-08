# Local Development Installation Guide

This guide walks you through running RallyIQ on your local machine for development.

---

## Prerequisites

Before you begin, make sure the following are installed:

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 20.x | `node --version` |
| npm | 10.x | `npm --version` |
| Git | Any | `git --version` |

**Install Node.js 20** (if not already installed):

- **Mac:** `brew install node@20` or download from [nodejs.org](https://nodejs.org)
- **Windows:** Download the LTS installer from [nodejs.org](https://nodejs.org)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/jeremiah9980/rallyiq.git
cd rallyiq
```

---

## Step 2 — Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because of a peer dependency conflict between Next.js 16 and some packages. This is safe to use.

Expected output ends with something like:
```
added 842 packages in 45s
```

---

## Step 3 — Create Your Environment File

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and set the following values:

```env
# Database — SQLite file stored locally
DATABASE_URL="file:./prisma/dev.db"

# Auth — generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-generated-secret-here"

# Auth — base URL of your local app
NEXTAUTH_URL="http://localhost:3000"
```

**Generate `NEXTAUTH_SECRET`:**

```bash
# Mac / Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

Copy the output and paste it as the value of `NEXTAUTH_SECRET`.

---

## Step 4 — Set Up the Database

Run these three commands in order:

```bash
# 1. Push the schema to your local SQLite database (creates prisma/dev.db)
npx prisma db push

# 2. Generate the Prisma TypeScript client
npx prisma generate

# 3. Seed the database with a demo admin user
DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
```

Expected output from seed:
```
✅ Demo user seeded: admin@rallyiq.com / demo123
```

---

## Step 5 — Start the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.2.7
- Local:        http://localhost:3000
- Ready in 2.1s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 6 — Log In

Navigate to [http://localhost:3000/login](http://localhost:3000/login) and use:

| Field | Value |
|-------|-------|
| Email | `admin@rallyiq.com` |
| Password | `demo123` |

---

## Verify Everything Works

After logging in, confirm these pages load:

- [http://localhost:3000/dashboard](http://localhost:3000) — Main dashboard
- [http://localhost:3000/coach](http://localhost:3000/coach) — Coach module
- [http://localhost:3000/teams](http://localhost:3000/teams) — Teams module

---

## Optional — Browse the Database

Prisma Studio gives you a visual interface to inspect and edit your database:

```bash
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555). You can create, edit, and delete records from here.

---

## Optional — Create Additional Users

**Via Prisma Studio (easiest):**

1. Run `npx prisma studio`
2. Click the `User` table
3. Click **Add record**
4. Fill in `email`, `name`, `role` (`admin`, `coach`, `player`, or `parent`)
5. For `password`, you need a bcrypt hash. Generate one:

```bash
node -e "const b=require('bcryptjs');b.hash('yourpassword',10).then(console.log)"
```

**Via the seed script:**

Edit `prisma/seed.ts` and add another `upsert` block:

```ts
await prisma.user.upsert({
  where: { email: 'coach@example.com' },
  update: {},
  create: {
    email: 'coach@example.com',
    name: 'Coach Smith',
    password: await bcrypt.hash('yourpassword', 10),
    role: 'coach',
  },
})
```

Then re-run:

```bash
DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
```

---

## Common Errors

### `Cannot find module 'bcryptjs'`
```bash
npm install --legacy-peer-deps
```

### `Environment variable not found: DATABASE_URL`
Make sure `.env.local` exists in the project root and contains `DATABASE_URL`.

### `Error: Invalid URL` on login page
`NEXTAUTH_URL` is missing or empty in `.env.local`. Add it:
```env
NEXTAUTH_URL="http://localhost:3000"
```

### Port 3000 already in use
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
npm run dev -- -p 3001
```

### `npx prisma db push` fails with schema errors
Delete the database and recreate it:
```bash
rm prisma/dev.db
npx prisma db push
npx prisma generate
DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
```

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint on all TypeScript files |
| `npx prisma studio` | Open database browser UI |
| `npx prisma db push` | Sync schema changes to database |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma db seed` | Run seed script |
