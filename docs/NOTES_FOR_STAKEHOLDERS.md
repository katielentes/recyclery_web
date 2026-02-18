# Notes for Stakeholders: Free Tier Limits and Gotchas

This document explains the main limitations and risks of running **The Recyclery** website and CMS on free tiers of **Supabase**, **Render**, and **Strapi**. It is written for project stakeholders, decision-makers, and anyone who needs to understand what can go wrong and what to plan for.

**Summary:** The stack uses Supabase (backend database, auth, storage), Render (hosting the Strapi CMS), and Strapi itself (open-source CMS). All of these can be used on free tiers, but each free tier has important limits. If those limits are exceeded or conditions are not met, the site or CMS can become slow, unavailable, or lose data. Upgrading to paid tiers or taking simple preventive steps reduces these risks.

---

## 1. Supabase (free tier)

**What it does for us:** Database for the backend (e.g. user data, app data), authentication (login/signup), and file storage (e.g. images). We may also use the same Supabase project for the Strapi CMS database.

### Gotchas and limits

| Issue | What it means | What you can do |
|-------|----------------|-----------------|
| **Project pausing (inactivity)** | Free projects are **paused after a period of inactivity** (e.g. around 7 days with no meaningful use). While paused, the project is **inaccessible**—no API, no database, no auth. | Generate some activity regularly (e.g. scheduled health checks or logins). Or upgrade to **Pro** so projects are not paused for inactivity. |
| **Paused too long (e.g. 90+ days)** | If a project stays paused for a long time (e.g. over 90 days), Supabase may **no longer offer “Restore” in the dashboard**. Your data is still available via **backup download**, but you must **restore that backup into a new project**—you cannot “unpause” the old one in place. | Restore the backup to a **new** Supabase project and point the app and CMS at the new project’s URL and keys. See [Supabase](https://supabase.com/dashboard) backup/restore options. |
| **Only 2 free projects per org** | You are allowed **two active free projects** per organization. Paused projects don’t count toward this limit. | Stay within 2 active free projects, or upgrade the organization to a paid plan for more. |
| **Free plan quotas** | Free tier has limits on database size, API requests, storage, and egress. If you **exceed** them, Supabase may notify you and then apply **restrictions** (e.g. read-only database, 402 errors, or pausing). | Monitor usage in the Supabase dashboard. Reduce usage or **upgrade to Pro** if you need more headroom. |
| **No guaranteed uptime / SLA** | Free tier is best-effort. There is no uptime guarantee or formal SLA. | For production or mission-critical use, plan for **Pro** or another paid option. |

### References

- [Supabase Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)  
- [Production checklist (Supabase)](https://supabase.com/docs/guides/deployment/going-into-prod) — recommends Pro for production.

---

## 2. Render (free tier)

**What it does for us:** Hosts the **Strapi CMS** (the admin panel and API that editors use to manage program content).

### Gotchas and limits

| Issue | What it means | What you can do |
|-------|----------------|-----------------|
| **Spin-down after 15 minutes idle** | The CMS service **goes to sleep** after about 15 minutes with no requests. The **first request after that** can take **30–60+ seconds** to respond (cold start). Editors and the public site may see slow or failed requests during that time. | Accept the delay, or upgrade to a **paid** Render plan (e.g. Starter) so the service stays on and does not spin down. |
| **750 hours per month** | Free tier gives **750 instance hours per calendar month**. If the service runs 24/7, that’s more than 750 hours, so you can **run out of hours** before the month ends. When you exceed the limit, **free services are suspended** until the next month. | Use the CMS only when needed, or upgrade to a paid plan for always-on hosting. |
| **Free PostgreSQL expires (30 days)** | If you use **Render’s own free PostgreSQL** for Strapi, that database **expires 30 days after creation**. You get a short window (e.g. 14 days) to upgrade before **data is deleted**. After that, Strapi sees an empty database (e.g. “create first admin” / registration page again). | **Do not rely on Render’s free Postgres for the CMS.** Use an **external database** (e.g. Supabase or Neon) and set Strapi’s `DATABASE_URL` to that. See `cms/HOSTING.md`. |
| **Ephemeral disk** | On free tier, **local filesystem changes are lost** when the service spins down or redeploys. Uploaded media stored only on the Render instance can disappear. | Store media in **external storage** (e.g. Supabase Storage, S3, Cloudinary) or use a paid Render plan with a persistent disk. |
| **No SLA** | Free tier is for hobby/testing. There is no uptime guarantee. | For a reliable, always-available CMS, use a **paid** Render plan or another host. |

### References

- [Render – Deploy for free](https://render.com/docs/free)  
- [Render – Free PostgreSQL 30-day expiration](https://render.com/changelog/free-postgresql-instances-now-expire-after-30-days-previously-90)

---

## 3. Strapi (CMS) on free hosting

**What it does for us:** Strapi is the **content management system** (admin UI and API) used to manage program content. Strapi itself is **free and open-source**. The “free tier” considerations are about **where** we host it (e.g. Render free tier) and **where** we store its data (e.g. Supabase or Render Postgres).

### Gotchas and limits

| Issue | What it means | What you can do |
|-------|----------------|-----------------|
| **Depends on Render (or other host)** | If Render free tier spins down, runs out of hours, or has issues, the **CMS is unavailable** (slow or down). | Same as Render section above: accept cold starts or upgrade Render / move to another host. |
| **Depends on database** | If the **database** (e.g. Supabase or Neon) is paused, expired, or deleted, Strapi sees an **empty DB** and shows the “create first admin” / registration page. All content and admin accounts are effectively lost for that DB. | Use a **persistent** database (Supabase active project, or Neon) and keep Supabase active or restore from backup if it was paused too long. See `cms/HOSTING.md`. |
| **Permissions (403)** | If the **Public** role in Strapi doesn’t have permission to read the right content (e.g. Program), the **frontend** gets **403 Forbidden** when calling the CMS API. | In Strapi Admin: Settings → Users & Permissions → Roles → Public → enable **find** and **findOne** for Program (and any other content the site needs). See `cms/HOSTING.md`. |
| **No formal support** | Community/self-hosted Strapi has no vendor SLA. Reliability depends on the hosting and database choices above. | Choose a stable host and DB (e.g. paid Render + Supabase, or alternatives in `cms/HOSTING.md`). |

---

## 4. Events and blog vs. current website

**Current website ([therecyclery.org](https://www.therecyclery.org/))** runs on **WordPress**. Editors can publish **blog posts** and add whatever content they want (events, announcements, posters, etc.) through the WordPress admin.

**This new site** does **not** currently have an **events section** or a blog. Out of the box you have:

- **Strapi CMS** for things like **Program** content and the **Top Banner** (site-wide announcement bar).
- **No built-in “Events” or “Blog” content types** or pages to display them.

To support **events** (e.g. fundraisers, volunteer events, classes) with **posters, dates, and highlights** in this new version, you would need to:

1. **Configure Strapi:** Add one or more content types (e.g. “Event”) with fields such as title, date, description, poster image, link, etc., and set API permissions so the frontend can read them.
2. **Configure the site:** Add frontend pages and/or components (e.g. an Events section on the home page, an Events list page, or blocks in the calendar area) that fetch and display this content from the Strapi API.

This is a deliberate gap: the new stack is more structured than WordPress, so events and rich blog-style content require a one-time setup in both Strapi and the site. Planning that setup (and any design for event posters and placement) is recommended before promising an “events” or “blog” experience equivalent to the current site.

---

## 5. Quick decision guide

| If you need… | Recommendation |
|--------------|----------------|
| **CMS and site to stay up without surprise downtime** | Use a **persistent database** (Supabase or Neon) for Strapi; consider **paid Render** (or similar) so the CMS doesn’t spin down. Keep Supabase **active** (activity or Pro) so it doesn’t pause. |
| **To avoid losing CMS content** | **Never** use Render’s free Postgres for Strapi. Use **Supabase** or **Neon** (or another external Postgres) and set `DATABASE_URL` on Render to that. |
| **To avoid losing backend data** | Keep the **Supabase** project **active** (regular activity or Pro). If it has been paused for a long time (e.g. 90+ days), **restore from backup to a new project** and point the app and CMS at the new project. |
| **Predictable cost and fewer surprises** | Plan for at least **one** paid service: e.g. **Render Starter** (~$7/mo) for the CMS and/or **Supabase Pro** so the project isn’t paused and you get better quotas. |

---

## 6. Where to find more detail

- **CMS hosting and troubleshooting (developers):** `cms/HOSTING.md`  
- **Supabase billing and quotas:** [Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)  
- **Render free tier:** [Deploy for free](https://render.com/docs/free)

---

*Last updated to reflect free tier behavior of Supabase, Render, and Strapi as of 2025. Vendor policies can change; check each provider’s official docs for current limits.*
