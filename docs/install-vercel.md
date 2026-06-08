# Vercel Deployment Guide

Deploy RallyIQ to Vercel for a fully managed, auto-scaling production environment. Vercel is the recommended deployment target for Next.js apps — zero server management, free tier available, and auto-deploys on every push to `main`.

---

## Prerequisites

- A [GitHub](https://github.com) account with the RallyIQ repository
- A [Vercel](https://vercel.com) account (free to create, sign in with GitHub)
- A PostgreSQL database (see Step 2 — SQLite is not supported in production)

---

## Step 1 — Push Your Code to GitHub

Make sure all your changes are committed and pushed:

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

---

## Step 2 — Create a PostgreSQL Database

SQLite only works on a local filesystem and is not suitable for production. Choose one of these managed PostgreSQL providers:

### Option A — Vercel Postgres (Neon) — Recommended

1. Go to [vercel.com](https://vercel.com) → your dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Give it a name (e.g. `rallyiq-db`) and click **Create**
4. Vercel will automatically inject `DATABASE_URL` and `POSTGRES_*` env vars into your project

### Option B — Supabase

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a region, set a database password, click **Create project**
3. Go to **Settings** → **Database** → copy the **Connection string (URI)**
4. It looks like: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`

### Option C — Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Provision PostgreSQL**
2. Click on the PostgreSQL service → **Variables** → copy `DATABASE_URL`

### Option D — Neon (standalone)

1. Go to [neon.tech](https://neon.tech) → **New project**
2. Copy the connection string from the dashboard

---

## Step 3 — Update Prisma for PostgreSQL

Open `prisma/schema.prisma` and change the datasource provider from `sqlite` to `postgresql`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Commit this change:

```bash
git add prisma/schema.prisma
git commit -m "chore: switch Prisma provider to postgresql"
git push origin main
```

---

## Step 4 — Push Schema to Your Production Database

Run this locally, substituting your real PostgreSQL connection string:

```bash
DATABASE_URL="your-postgresql-connection-string" npx prisma db push
DATABASE_URL="your-postgresql-connection-string" npx prisma db seed
```

This creates all tables and seeds the demo admin user (`admin@rallyiq.com` / `demo123`).

---

## Step 5 — Import the Project to Vercel

1. Go to [vercel.com](https://vercel.com/new)
2. Click **Import Git Repository**
3. Find and select `jeremiah9980/rallyiq`
4. Vercel auto-detects Next.js — **leave all framework settings as default**
5. Do **not** click Deploy yet — configure environment variables first

---

## Step 6 — Set Environment Variables

In the Vercel import screen, expand **Environment Variables** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Output of `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://rallyiq.vercel.app`) |

> **Note:** If you used Vercel Postgres in Step 2, `DATABASE_URL` is already injected automatically — you can skip adding it manually.

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

**For `NEXTAUTH_URL`:** You can use your preview URL (e.g. `https://rallyiq.vercel.app`) or a custom domain. If you don't know it yet, set it to a placeholder and update it after the first deploy.

---

## Step 7 — Deploy

Click **Deploy**. Vercel will:
1. Install dependencies
2. Run `prisma generate`
3. Run `next build`
4. Deploy to their global edge network

Deployment typically takes 2–4 minutes. You'll see a live URL when it's done:
```
https://rallyiq.vercel.app
```

---

## Step 8 — Update NEXTAUTH_URL

After your first deploy, copy the final Vercel URL and update the environment variable:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Edit `NEXTAUTH_URL` → set it to your exact deployment URL
3. Go to **Deployments** → click the three dots on the latest deploy → **Redeploy**

---

## Step 9 — Verify the Deployment

1. Open your Vercel URL in a browser
2. Navigate to `/login`
3. Log in with `admin@rallyiq.com` / `demo123`
4. Confirm the dashboard loads

---

## Automatic Deployments (CD)

Vercel watches your `main` branch by default. Every time you push to `main`:

```bash
git push origin main
```

Vercel automatically triggers a new deployment. No action required.

**Preview Deployments:** Vercel also creates a unique preview URL for every pull request — useful for testing changes before merging.

---

## Adding a Custom Domain

1. Go to your Vercel project → **Settings** → **Domains**
2. Enter your domain (e.g. `rallyiq.com`) and click **Add**
3. Follow Vercel's DNS instructions (add a CNAME or A record at your registrar)
4. Update `NEXTAUTH_URL` to your custom domain and redeploy

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret |
| `NEXTAUTH_URL` | Yes | Full base URL of your deployment |
| `GOOGLE_CLIENT_ID` | No | Google OAuth (if enabling Google login) |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth |
| `GAMECHANGER_API_KEY` | No | GameChanger integration |
| `NCS_API_KEY` | No | NCS integration |
| `AWS_ACCESS_KEY_ID` | No | S3 file storage |
| `AWS_SECRET_ACCESS_KEY` | No | S3 file storage |
| `AWS_S3_BUCKET` | No | S3 bucket name |
| `AWS_REGION` | No | S3 region |
| `SMTP_HOST` | No | Email notifications |

---

## Common Errors

### Build fails: `Error: PrismaClientInitializationError`
The `DATABASE_URL` environment variable is missing or incorrect. Check it in **Settings → Environment Variables**.

### Login redirects loop or fails
`NEXTAUTH_URL` doesn't match your actual deployment URL. Update it in Vercel env vars and redeploy.

### `Invalid URL` error on login page
Same as above — `NEXTAUTH_URL` is empty or malformed.

### Build fails: `Cannot find module '@prisma/client'`
Vercel needs to run `prisma generate` during build. Add this to `package.json`:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

Commit and push — Vercel will re-run.

### Database tables don't exist
You need to push the Prisma schema to your production database manually:
```bash
DATABASE_URL="your-production-url" npx prisma db push
```
