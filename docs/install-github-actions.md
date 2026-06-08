# GitHub Actions CI/CD Guide

RallyIQ ships with a GitHub Actions workflow that automatically lints and builds the project on every push and pull request. This guide explains how it works, how to configure it, and how to extend it.

---

## What the CI Pipeline Does

Every push to `main` or `claude/**` branches, and every pull request targeting `main`, triggers two parallel jobs:

| Job | What It Checks |
|-----|---------------|
| **Lint** | Runs ESLint on all `src/**/*.ts` and `src/**/*.tsx` files |
| **Build & Type Check** | Runs `tsc --noEmit` (TypeScript) then `next build` |

Both jobs run on `ubuntu-latest` with Node.js 20.

---

## Workflow File Location

```
.github/workflows/ci.yml
```

---

## Full Workflow Reference

```yaml
name: CI

on:
  push:
    branches: [main, "claude/**"]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx eslint "src/**/*.{ts,tsx}"

  build:
    name: Build & Type Check
    runs-on: ubuntu-latest
    environment: production
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL || 'http://localhost:3000' }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx prisma generate
      - run: tsc --noEmit
      - run: npm run build
```

---

## Step 1 — Fork or Push the Repository to GitHub

If you haven't already, push RallyIQ to your GitHub account:

```bash
# If starting fresh
git init
git remote add origin https://github.com/YOUR_USERNAME/rallyiq.git
git push -u origin main

# If already cloned
git push origin main
```

GitHub Actions activates automatically — no installation required. It runs on GitHub's infrastructure.

---

## Step 2 — Add Required Secrets

The build job needs environment variables to generate the Prisma client and build the app. These are stored as encrypted GitHub Secrets.

### How to Add a Secret

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. In the left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret below

### Required Secrets

| Secret Name | Value | Notes |
|-------------|-------|-------|
| `DATABASE_URL` | `file:./dev.db` (SQLite for CI) or a real PostgreSQL URL | SQLite works for build/type checks; use Postgres for integration tests |
| `NEXTAUTH_SECRET` | Output of `openssl rand -base64 32` | Any 32+ char random string |
| `NEXTAUTH_URL` | Optional — defaults to `http://localhost:3000` | Only needed if your build references it explicitly |

**Generate `NEXTAUTH_SECRET`:**

```bash
# Mac / Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

**For CI-only `DATABASE_URL`:** The build step only needs to generate the Prisma client and compile TypeScript — it doesn't need a live database. Use:
```
file:./dev.db
```

---

## Step 3 — Add the `production` Environment (Optional but Recommended)

The build job runs under `environment: production`. This lets you set environment-specific secrets and add protection rules (e.g., require approval before deploying).

1. Go to **Settings** → **Environments** → **New environment**
2. Name it `production`
3. Optionally add **Required reviewers** and **deployment branch rules** (restrict to `main`)
4. Add the secrets (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) here instead of at the repository level for tighter control

---

## Step 4 — Verify CI Is Running

1. Make any small change and push to `main`:
   ```bash
   echo "# test" >> README.md
   git add README.md && git commit -m "test: trigger CI"
   git push origin main
   ```
2. Go to your repository → **Actions** tab
3. You should see a workflow run appear within seconds
4. Click into it to see the Lint and Build jobs running in parallel

A green checkmark means CI passed. A red X means something failed — click the job to see the logs.

---

## How CI Integrates with Pull Requests

When you open a pull request against `main`:

1. GitHub automatically runs both CI jobs on the PR branch
2. The PR page shows a status check section with pass/fail for each job
3. You can (optionally) require CI to pass before a PR can be merged:
   - Go to **Settings** → **Branches** → **Add branch protection rule**
   - Branch name pattern: `main`
   - Check **Require status checks to pass before merging**
   - Search for and add `Lint` and `Build & Type Check`

---

## Extending the Workflow

### Add Automated Tests

When you add tests (e.g., with Vitest or Jest), add a test job:

```yaml
  test:
    name: Test
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: "file:./dev.db"
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      NEXTAUTH_URL: "http://localhost:3000"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx prisma generate
      - run: npm test
```

### Auto-Deploy to Vercel on Merge

Add a deploy job that runs only on pushes to `main` (not PRs):

```yaml
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: [lint, build]          # Only deploy if both pass
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install -g vercel
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub Secrets (find these in your Vercel project settings).

### Run CI Only on Changed Files

To skip CI for documentation-only changes:

```yaml
on:
  push:
    branches: [main, "claude/**"]
    paths-ignore:
      - "**.md"
      - "docs/**"
  pull_request:
    branches: [main]
    paths-ignore:
      - "**.md"
      - "docs/**"
```

---

## Troubleshooting CI Failures

### Lint Job Fails

Click the Lint job → expand the failing step → look for the file and line number ESLint reports.

Common causes:
- Unused variable: prefix it with `_` (e.g. `_unused`) — ESLint ignores `^_` pattern
- `any` type: replace with a proper type or cast with `as unknown`
- Missing return type: add an explicit return type annotation

Fix locally first:
```bash
npm run lint
```

### Build Job Fails: TypeScript Error

The logs will show `tsc --noEmit` output with file and line numbers. Fix the type errors and push again.

### Build Job Fails: `PrismaClientInitializationError`

The `DATABASE_URL` secret is missing or wrong. Go to **Settings → Secrets** and verify it.

### Build Job Fails: `NEXTAUTH_URL Invalid URL`

Add `NEXTAUTH_URL` as a secret (value: `http://localhost:3000`) or verify the fallback in `ci.yml`:
```yaml
NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL || 'http://localhost:3000' }}
```

### `npm ci` Fails

The `package-lock.json` may be out of sync. Run locally:
```bash
rm package-lock.json
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "chore: regenerate lockfile"
git push
```

---

## CI Badge (Optional)

Add a CI status badge to your README:

```markdown
[![CI](https://github.com/jeremiah9980/rallyiq/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremiah9980/rallyiq/actions/workflows/ci.yml)
```

This shows a live green/red badge in your README reflecting the current CI status on `main`.
