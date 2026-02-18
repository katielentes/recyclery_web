# Strapi CMS – Free & Cheap Hosting Options

This guide covers practical ways to host this Strapi app for **free** or **very low cost** (~$0–5/month). Your app already supports **PostgreSQL** (via `DATABASE_URL`) and **SQLite** (default); use Postgres on managed hosts and SQLite or Postgres on a VM.

**Stakeholders:** For a plain-language summary of free-tier limits and gotchas (Supabase, Render, Strapi), see **[docs/NOTES_FOR_STAKEHOLDERS.md](../docs/NOTES_FOR_STAKEHOLDERS.md)**.

---

## Troubleshooting: "CMS API Error: 403"

If your deployed frontend shows **CMS Connection Error: CMS API Error: 403**, the CMS is up and responding—**403 means "Forbidden"**, not a timeout or spin-down. The most common cause is **Strapi permissions**.

### Fix: Allow public read access to Program

Your frontend calls `/api/programs` with no API token, so Strapi treats the request as the **Public** role. If that role can’t read Program, you get 403.

1. Open your **Strapi Admin** (e.g. `https://your-cms.onrender.com/admin`).
2. Go to **Settings** (left sidebar) → **Users & Permissions plugin** → **Roles**.
3. Click the **Public** role.
4. Under **Program**, enable:
   - **find** (list programs)
   - **findOne** (get a single program by id)
5. Click **Save**.

Reload your frontend; the 403 should be gone. If you add other content types the frontend needs (e.g. Media), enable **find** / **findOne** for those too under Public.

### Other possible causes of 403

- **CORS:** If the exact frontend URL isn’t allowed, the browser may show a CORS error; if you truly get a 403 response body from the API, permissions are the usual cause. Your `config/server.ts` already allows several origins and `*`; for a new Vercel preview URL, add it to the `CORS_ORIGIN` env var on Render (e.g. `https://recyclery-web-frontend-git-cms-xxx.vercel.app`).
- **Render free tier:** Hitting the free tier limit usually means the service stops or you get 503/errors from Render, not a 403 from Strapi. If 403 persists after fixing permissions, check the Render dashboard for service status and any usage limits.

---

## Troubleshooting: "Knex: Timeout acquiring a connection" on Render deploy

If the **build** succeeds but the **deploy** fails with:

```text
Knex: Timeout acquiring a connection. The pool is probably full. Are you missing a .transacting(trx) call?
```

Strapi is trying to connect to PostgreSQL at startup; the database (e.g. Supabase or Render Postgres) may be cold or slow to accept connections, so the first connection times out.

**What we did in code:** The CMS `config/database.ts` now uses **smaller connection pool** and **longer acquire timeout** when `DATABASE_URL` is set (cloud): pool `min: 0`, `max: 5`, and `acquireConnectionTimeout: 90000` (90 seconds). That gives the DB time to wake up and avoids exhausting connections.

**If it still fails on deploy:**

1. **Retry the deploy** – Render often retries; the second run may succeed once the DB is ready.
2. **Optional env on Render:** You can override in the Strapi service’s **Environment**:
   - `DATABASE_CONNECTION_TIMEOUT=120000` (2 minutes)
   - `DATABASE_POOL_MAX=3`
3. **Database cold start:** If the DB is on a free tier that spins down (e.g. Supabase after inactivity), the first request to the DB after wake-up can be slow. Keeping the DB active or using a paid tier reduces this.

After a successful start you’ll see “Strapi started successfully” and the admin URL; “No open ports detected” during the **failed** run just means Strapi exited before binding to the port (it crashed during DB bootstrap).

---

## Troubleshooting: "Registration page" / database keeps resetting (Render free tier)

If you open your CMS and see **Strapi’s “create first admin user” registration page** again, it means Strapi is seeing an **empty database**. All content and admin accounts are gone.

On **Render’s free tier** this often happens because:

- **Free PostgreSQL expires after 30 days.** After that you have 14 days to upgrade before the instance (and data) is removed. If the DB was recreated or you’re past that window, you get a fresh DB. See [Render’s free Postgres policy](https://render.com/changelog/free-postgresql-instances-now-expire-after-30-days-previously-90).
- **Free web services have an ephemeral filesystem**—anything not in an external DB can be lost on redeploy or restart.

So the database (or the Postgres instance) is going away or being recreated, and Strapi starts from scratch and shows the registration page.

### Fix: Use an external PostgreSQL (recommended)

Keep your **Strapi app on Render free tier**, but point it at a **free external Postgres** that doesn’t expire. Your data then lives outside Render and persists.

**Option A – Supabase (recommended if you use or want to use Supabase)**  
You can use a Supabase Postgres database for Strapi. Strapi creates its own tables (e.g. `strapi_*`, admin, core) and won't conflict with other tables in the same project.

**One project, one database (backend + CMS together):**  
One Supabase project = one Postgres database. Your backend (auth, tables, storage) and Strapi can **share that same database**. Strapi’s tables live alongside your backend tables in the same `postgres` database; they use different table names so there’s no conflict. Your backend uses the same project’s `SUPABASE_URL` and keys; Strapi (on Render) uses the same project’s `DATABASE_URL`. So yes—they should be in the same DB if you want one place for everything.

**If your existing Supabase project is paused:** Supabase pauses free-tier projects after inactivity (e.g. 90+ days). Paused projects can’t be restored in place—you can only [download backups](https://supabase.com/dashboard) or **restore a backup to a new project**. To have **one database for both backend and CMS**:

1. **Restore your old backup to a new Supabase project** (use Supabase’s “Restore the backup to a new Supabase project” flow). That gives you one new, active project with all your backend data (tables, auth, storage).
2. Use **that same project** for Strapi: copy its Database connection string (Session mode) and set it as `DATABASE_URL` on Render. Strapi will create its tables in the same database alongside your existing backend tables.
3. Point your backend app at the new project (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.) so it uses the restored project.

If you already created a **CMS-only** new project and added Strapi there, you have two choices: (a) Keep that project for CMS only and restore the backup to a **second** new project for the backend (two projects, two DBs), or (b) Start over with one project: restore the backup to a new project first, then point Strapi at that project’s `DATABASE_URL` so both backend and CMS live in the same DB (you’d re-create your Strapi admin and content in the restored project). Restoring first, then adding Strapi to that project, is the simplest way to get everything in one database.

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select an **active** project—or click **New project** to create one (free tier).
2. Go to **Project Settings** (gear) → **Database**.
3. Under **Connection string**, choose the **URI** tab. Use **Session mode** (pooler, port 5432)—it's the most reliable from Render. If you prefer a direct connection, use **Direct connection** (port 5432); if Render has connection issues, switch to Session mode.
4. Copy the URI (replace `[YOUR-PASSWORD]` with your database password if needed). Session mode looks like: `postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres`
5. In **Render** → your Strapi service → **Environment**: set `DATABASE_CLIENT=postgres` and `DATABASE_URL` to the Supabase connection string (replace Render's internal Postgres URL).
6. Redeploy the service. Strapi will use Supabase; your CMS data will persist. The first time you'll see the registration page once—create your admin, then set **Public** → **Program** (find / findOne) as in the 403 section above.

**Option B – Neon (free)**  
[Neon](https://neon.tech) offers a free Postgres tier with a persistent connection string and IPv4 support. Sign up at [neon.tech](https://neon.tech), create a project and database, copy the connection string, and set it as `DATABASE_URL` on Render (same env steps as above).

**After switching to an external DB**

- The first time you use the new DB it will be empty, so you’ll see the registration page **once**. Create your admin user, then set **Public** role permissions for **Program** (find / findOne) as in the 403 section above.
- From then on, that database persists; you won’t lose admins or content when Render’s free tier resets or the free Postgres expires.

---

## Quick comparison

| Option | Cost | Effort | Best for |
|--------|------|--------|----------|
| **Render** | Free tier (spins down) or $7/mo | Low | Easiest; you may already use it |
| **Railway** | $5 trial, then ~$1–5/mo | Low | Simple deploys, good DX |
| **Oracle Cloud (VM)** | **$0 forever** | Medium | Truly free, full control |
| **Fly.io** | $5 one-time credit, then ~$2–4/mo | Medium | Global edge, small bill |
| **Hetzner / DO** | ~€3–5 or $4–6/mo | Medium | Cheap VPS, predictable |

---

## 1. Render (free tier or $7/mo)

**Good if:** You want zero server management and are okay with the free service sleeping after ~15 min inactivity.

- **Free:** 750 hours/month, 512 MB RAM, **spins down when idle** (cold start ~30–60 s).
- **Paid (Starter):** $7/month, always on, no spin-down.

**Important – free tier and data loss:** Render’s **free PostgreSQL expires after 30 days** (then 14 days before data is deleted). When the DB is gone or recreated, Strapi sees an empty DB and shows the “create first admin” registration page again. To avoid losing your CMS data, use an **external Postgres** (e.g. [Supabase](https://supabase.com) if you already use it for your backend, or [Neon](https://neon.tech)) and set `DATABASE_URL` on Render to that connection string. See **[Troubleshooting: "Registration page" / database keeps resetting](#troubleshooting-registration-page--database-keeps-resetting-render-free-tier)** above.

**Steps:**

1. [Render – Deploy Strapi](https://render.com/docs/deploy-strapi): connect your repo, use the `cms` directory as root.
2. Add a **PostgreSQL** database: either use Render’s (know it may expire on free tier) or **prefer an external DB** (Supabase or Neon—see troubleshooting above) and skip Render Postgres.
3. Set env vars (Render will suggest them when you add the DB):
   - `DATABASE_CLIENT=postgres`
   - `DATABASE_URL` = your Postgres URL (from Render Postgres, or Supabase/Neon if using an external DB—see troubleshooting above)
   - `NODE_VERSION=18` (or 20)
   - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET` (generate random strings)
   - `PUBLIC_URL` = your Render service URL (e.g. `https://your-cms.onrender.com`)
4. **Install Postgres driver** in this project (Render uses Postgres):
   ```bash
   cd cms && npm install pg
   ```
5. Build command: `npm install && npm run build`  
   Start command: `npm run start` (or `npm run start:render`).

**Media files:** On free tier, use a **persistent disk** (Render allows attaching one) for uploads, or switch to cloud storage (e.g. S3/Cloudinary) so uploads survive redeploys.

---

## 2. Railway (~$5 trial, then ~$1–5/mo)

**Good if:** You want a simple, app-like deploy and don’t mind a few dollars after the trial.

- **Trial:** $5 one-time credit (no card required with GitHub).
- **After trial:** Often ~$1–5/month for Strapi + small Postgres depending on usage.

**Steps:**

1. [Railway – Deploy Strapi](https://railway.com/deploy/strapi) or “New Project” → “Deploy from GitHub” and select this repo, **Root Directory** = `cms`.
2. Add **PostgreSQL** in the same project (Railway gives a `DATABASE_URL`).
3. Set env vars:
   - `DATABASE_CLIENT=postgres`
   - `DATABASE_URL` = (from Railway Postgres)
   - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`
   - `PUBLIC_URL` = your Railway app URL (e.g. `https://your-cms.up.railway.app`)
4. Install Postgres driver: `cd cms && npm install pg`
5. Build: `npm install && npm run build`  
   Start: `npm run start`.

Railway’s docs and Strapi integration will walk you through; the main requirement is Postgres + the env vars above.

---

## 3. Oracle Cloud – Always Free VM ($0 forever)

**Good if:** You’re okay with a bit of setup (SSH, Node, process manager) and want **no ongoing cost**.

**What you get (Always Free):**

- **AMD:** 2× VMs with 1/8 OCPU and **1 GB RAM** each, or  
- **ARM (Ampere A1):** Up to 4 OCPUs and **24 GB RAM** total (e.g. 1× 4-core 24 GB or 2× 2-core 12 GB).
- 200 GB block storage, 10 TB outbound/month.

**Catch:** You must create VMs in your **home region**. Some regions show “out of host capacity” for Always Free; try another availability domain or region.

**High-level plan:**

1. **Sign up:** [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) – credit card required for verification; Always Free resources are not charged.
2. **Create a VM:**
   - Compute → Instances → Create instance.
   - Choose **VM.Standard.E2.1.Micro** (1 GB) or **VM.Standard.A1.Flex** (ARM, scale OCPU/memory within free limits).
   - OS: Ubuntu 22.04.
   - Add your SSH public key.
   - Ensure the instance has a **public IP** (or use a load balancer later).
3. **Open firewall:** In the VM’s security list / ingress rules, allow TCP **22** (SSH) and **1337** (or the port Strapi uses).
4. **SSH in and install:**
   ```bash
   sudo apt update && sudo apt install -y nodejs npm git
   # Prefer Node 18+ via NodeSource or nvm
   sudo npm install -g pm2
   ```
5. **Clone your repo** (or copy the `cms` folder), install deps, build:
   ```bash
   cd cms
   npm install
   npm run build
   ```
6. **Database on the VM:**
   - **Option A – SQLite (simplest):** Use default `DATABASE_CLIENT=sqlite`. Set `DATABASE_FILENAME` to a path that persists (e.g. `/var/app/strapi/data.db`) and ensure the app user can write there.
   - **Option B – PostgreSQL:** `sudo apt install postgresql`, create a DB and user, set `DATABASE_CLIENT=postgres` and `DATABASE_URL`.
7. **Env file** (e.g. `.env` in `cms/`):
   ```env
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=...
   API_TOKEN_SALT=...
   ADMIN_JWT_SECRET=...
   JWT_SECRET=...
   PUBLIC_URL=http://YOUR_VM_PUBLIC_IP:1337
   ```
8. **Run with PM2:**
   ```bash
   cd /path/to/cms && pm2 start server-alt.js --name strapi
   pm2 save && pm2 startup
   ```
9. **Optional:** Put Nginx in front and use Let’s Encrypt (e.g. Certbot) for HTTPS and a domain.

**Idle reclaim:** Oracle may reclaim Always Free VMs if they’re very idle (low CPU/memory/network). Running Strapi with occasional traffic is usually enough to avoid that.

---

## 4. Fly.io (~$2–4/mo after $5 credit)

**Good if:** You want a global edge and don’t mind a small monthly bill after the one-time $5 credit.

- New accounts get **$5 one-time credit** and **3× 256 MB shared VMs free** (limited).
- A small Strapi app often needs a bit more; expect ~\$2–4/month after the credit.

**Steps:**

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) and sign up.
2. In your repo (from project root or `cms`), run `fly launch` and follow prompts; set **App Name** and **Region**.
3. Add a **Postgres** app: `fly postgres create` (or use an external Postgres and set `DATABASE_URL`).
4. Add a `Dockerfile` in `cms/` if not present (Strapi docs have examples); or use Fly’s Node buildpack.
5. Set secrets:
   ```bash
   fly secrets set APP_KEYS=... API_TOKEN_SALT=... ADMIN_JWT_SECRET=... JWT_SECRET=...
   fly secrets set DATABASE_URL=... DATABASE_CLIENT=postgres
   fly secrets set PUBLIC_URL=https://YOUR_APP.fly.dev
   ```
6. Deploy: `fly deploy`.

Use Fly’s **volumes** for persistent uploads if you keep media on disk.

---

## 5. Cheap VPS (Hetzner, DigitalOcean, etc.)

**Hetzner:** ~€3–4/month for a small VPS (e.g. CX22).  
**DigitalOcean:** ~$4–6/month for a basic Droplet.

Setup is similar to **Oracle Cloud** above: Ubuntu VM → Node, PM2, Postgres or SQLite, Nginx + SSL if you want a domain. You get a static IP and full control; no “spin down” like Render’s free tier.

---

## Checklist for any host

- [ ] **Database:** Postgres on Render/Railway/Fly; SQLite or Postgres on your VM.
- [ ] **Env vars:** `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `PUBLIC_URL`, and if Postgres: `DATABASE_CLIENT=postgres`, `DATABASE_URL`.
- [ ] **Postgres driver:** Run `npm install pg` in `cms` when using Postgres.
- [ ] **CORS:** Your `cms/config/server.ts` already allows several origins; add your frontend URL (e.g. Vercel) to `CORS_ORIGIN` or the env array if needed.
- [ ] **Frontend:** Set `VITE_CMS_URL` to your Strapi URL (e.g. `https://your-cms.onrender.com`) wherever the frontend is built (e.g. Vercel).

---

## Recommendation

- **Zero cost, minimal hassle:** Stay on **Render free tier** (or move to it), add Postgres + persistent disk or external media storage.
- **Zero cost, okay with a VM:** Use **Oracle Cloud Always Free** (one small VM + SQLite or Postgres on the same machine).
- **A few dollars, least hassle:** **Railway** or **Render paid** ($7) for always-on Strapi + Postgres without managing a server.

If you tell me which option you prefer (e.g. “Oracle VM” or “Railway”), I can outline exact steps for this repo (e.g. Render/Railway build commands, or a minimal Oracle setup script).
