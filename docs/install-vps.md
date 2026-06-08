# VPS / Self-Hosted Deployment Guide

Deploy RallyIQ on your own server (AWS EC2, DigitalOcean Droplet, Hetzner, Linode, etc.) for full infrastructure control, no vendor lock-in, and predictable monthly costs.

---

## Architecture Overview

```
Internet → Nginx (port 80/443) → PM2 (Next.js on port 3000) → PostgreSQL
```

- **Nginx** — Reverse proxy, handles HTTPS, serves as the public entry point
- **PM2** — Process manager that keeps Next.js running and restarts it on crash
- **PostgreSQL** — Production database (replaces SQLite)
- **Certbot** — Free SSL/TLS certificates via Let's Encrypt

---

## Prerequisites

- A VPS with Ubuntu 22.04 LTS (minimum 1 vCPU, 1 GB RAM, 10 GB disk)
- A domain name pointed at your server's IP address (required for HTTPS)
- SSH access to the server
- Root or sudo privileges

---

## Step 1 — Point Your Domain to the Server

Before starting, add a DNS A record pointing your domain to the server's public IP:

| Type | Name | Value |
|------|------|-------|
| A | `@` or `rallyiq.com` | Your server's public IP |
| A | `www` | Your server's public IP |

DNS changes can take up to 24 hours to propagate, but usually happen within minutes.

---

## Step 2 — Initial Server Setup

SSH into your server:

```bash
ssh root@your-server-ip
```

Update the system and install essentials:

```bash
apt update && apt upgrade -y
apt install -y git curl wget ufw
```

Set up a firewall:

```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

---

## Step 3 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version   # Should print v20.x.x
npm --version    # Should print 10.x.x
```

---

## Step 4 — Install and Configure PostgreSQL

```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

Create a database and user for RallyIQ:

```bash
sudo -u postgres psql
```

Inside the PostgreSQL prompt:

```sql
CREATE DATABASE rallyiq;
CREATE USER rallyiq_user WITH ENCRYPTED PASSWORD 'choose-a-strong-password';
GRANT ALL PRIVILEGES ON DATABASE rallyiq TO rallyiq_user;
\c rallyiq
GRANT ALL ON SCHEMA public TO rallyiq_user;
\q
```

Your connection string will be:
```
postgresql://rallyiq_user:choose-a-strong-password@localhost:5432/rallyiq
```

---

## Step 5 — Install Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## Step 6 — Create an App User (Recommended)

Run the app as a non-root user for security:

```bash
adduser --disabled-password --gecos "" rallyiq
usermod -aG sudo rallyiq
```

Switch to the app user for the remaining steps:

```bash
su - rallyiq
```

---

## Step 7 — Clone the Repository

```bash
git clone https://github.com/jeremiah9980/rallyiq.git
cd rallyiq
```

---

## Step 8 — Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

## Step 9 — Configure Environment Variables

```bash
cp .env.example .env.local
nano .env.local
```

Set the following values:

```env
DATABASE_URL="postgresql://rallyiq_user:choose-a-strong-password@localhost:5432/rallyiq"
NEXTAUTH_SECRET="paste-your-generated-secret-here"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Save and close (`Ctrl+O`, `Enter`, `Ctrl+X` in nano).

---

## Step 10 — Update Prisma for PostgreSQL

Open `prisma/schema.prisma`:

```bash
nano prisma/schema.prisma
```

Change the datasource block:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Step 11 — Set Up the Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Expected seed output:
```
✅ Demo user seeded: admin@rallyiq.com / demo123
```

---

## Step 12 — Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next/` directory. It takes 1–3 minutes.

---

## Step 13 — Install PM2 and Start the App

PM2 keeps the Node.js process running and restarts it automatically if it crashes.

```bash
npm install -g pm2
pm2 start npm --name "rallyiq" -- start
pm2 save
```

Make PM2 start on boot (run as root or with sudo):

```bash
pm2 startup
# Copy and run the command PM2 prints
```

Verify the app is running on port 3000:

```bash
curl http://localhost:3000
```

You should see HTML output.

---

## Step 14 — Configure Nginx as a Reverse Proxy

Switch back to root or use sudo:

```bash
exit   # back to root, or use sudo for the commands below
```

Create an Nginx config for RallyIQ:

```bash
nano /etc/nginx/sites-available/rallyiq
```

Paste this configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

Enable the site and test:

```bash
ln -s /etc/nginx/sites-available/rallyiq /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Your app should now be accessible at `http://yourdomain.com`.

---

## Step 15 — Enable HTTPS with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email address
- Agree to the terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: yes)

Certbot automatically updates your Nginx config and sets up auto-renewal. Certificates renew every 90 days automatically.

Verify auto-renewal:
```bash
certbot renew --dry-run
```

---

## Step 16 — Verify the Full Stack

Open `https://yourdomain.com` in your browser. Navigate to `/login` and log in with:

| Field | Value |
|-------|-------|
| Email | `admin@rallyiq.com` |
| Password | `demo123` |

---

## Deploying Updates

When you push new code to GitHub, deploy it to the server:

```bash
# On the server, as the rallyiq user
cd ~/rallyiq
git pull origin main
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push         # Only needed if schema changed
npm run build
pm2 restart rallyiq
```

---

## Automating Deployments with a Deploy Script

Create a deploy script on the server:

```bash
nano ~/deploy.sh
```

```bash
#!/bin/bash
set -e

cd /home/rallyiq/rallyiq

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Generating Prisma client..."
npx prisma generate

echo "Pushing schema changes..."
npx prisma db push

echo "Building..."
npm run build

echo "Restarting app..."
pm2 restart rallyiq

echo "Deploy complete!"
```

```bash
chmod +x ~/deploy.sh
```

Now you can deploy with a single command:
```bash
~/deploy.sh
```

You can trigger this remotely from GitHub Actions using SSH secrets — see the GitHub Actions guide for details.

---

## Monitoring and Logs

```bash
# View live app logs
pm2 logs rallyiq

# View last 100 lines
pm2 logs rallyiq --lines 100

# Monitor CPU and memory
pm2 monit

# Check app status
pm2 status

# View Nginx access logs
tail -f /var/log/nginx/access.log

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## Backups

Back up the PostgreSQL database regularly:

```bash
# Manual backup
pg_dump -U rallyiq_user rallyiq > backup-$(date +%Y%m%d).sql

# Restore from backup
psql -U rallyiq_user rallyiq < backup-20260101.sql
```

Automate with cron (runs daily at 2am):

```bash
crontab -e
```

Add:
```
0 2 * * * pg_dump -U rallyiq_user rallyiq > /home/rallyiq/backups/backup-$(date +\%Y\%m\%d).sql 2>&1
```

---

## Common Errors

### Nginx 502 Bad Gateway
The Next.js app isn't running on port 3000.
```bash
pm2 status            # Check if rallyiq is online
pm2 logs rallyiq      # Check for startup errors
pm2 restart rallyiq
```

### SSL Certificate Error
Certbot couldn't reach your domain — DNS may not have propagated yet.
```bash
nslookup yourdomain.com   # Should return your server IP
```

### `EACCES: permission denied` on npm install
Run as the `rallyiq` user, not root.

### App won't start after deploy
```bash
pm2 logs rallyiq --lines 50    # Look for the error
```

Common causes: missing env variable, Prisma client not generated, schema mismatch.

### Database connection refused
```bash
systemctl status postgresql    # Ensure it's running
systemctl start postgresql
```

---

## Security Checklist

- [ ] Firewall enabled (`ufw status`)
- [ ] SSH key auth only (disable password auth in `/etc/ssh/sshd_config`)
- [ ] App runs as non-root user
- [ ] HTTPS enabled and HTTP redirects to HTTPS
- [ ] Strong database password
- [ ] `NEXTAUTH_SECRET` is at least 32 random characters
- [ ] `.env.local` is not committed to Git (it's in `.gitignore`)
- [ ] PostgreSQL only listens on localhost (default behavior)
- [ ] Regular database backups configured
