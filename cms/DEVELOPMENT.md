# Recyclery CMS - Local Development Guide

This is a Strapi CMS application for managing content for the Recyclery website. This guide covers local development setup, running the application, and troubleshooting common issues.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git

### Initial Setup
1. **Clone the repository and navigate to the CMS directory:**
   ```bash
   cd cms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the application (required for first run):**
   ```bash
   npm run build
   ```

4. **Start the development server:**
   ```bash
   npm run pm2:start
   ```

5. **Access the admin panel:**
   - Open [http://localhost:1337/admin](http://localhost:1337/admin)
   - Create your first admin user account

## 🛠️ Development Commands

### Standard Strapi Commands
```bash
npm run develop    # Start Strapi in development mode
npm run build      # Build the application for production
npm run start      # Start Strapi in production mode
npm run console    # Open Strapi console
```

### Custom Server Commands
```bash
npm run start:alt      # Start with custom server (TypeScript support)
npm run dev:alt        # Development with custom server
```

### PM2 Process Management (Recommended)
```bash
npm run pm2:start      # Start Strapi with PM2
npm run pm2:stop       # Stop the Strapi process
npm run pm2:restart    # Restart without downtime
npm run pm2:delete     # Remove from PM2
npm run pm2:logs       # View application logs
npm run pm2:status     # Check process status
```

## 🏗️ Project Structure

```
cms/
├── config/                 # Strapi configuration files
│   ├── admin.ts          # Admin panel configuration
│   ├── api.ts            # API configuration
│   ├── database.ts       # Database configuration
│   ├── middlewares.ts    # Middleware configuration
│   ├── plugins.ts        # Plugin configuration
│   └── server.ts         # Server configuration
├── src/
│   ├── api/              # API endpoints and business logic
│   │   ├── program/      # Program content type
│   │   └── top-banner/   # Top Banner (single type) for site-wide announcements
│   ├── components/       # Reusable components
│   ├── extensions/       # Plugin extensions
│   └── index.ts          # Application entry point
├── database/              # Database migrations and seeds
├── public/                # Public assets and uploads
├── types/                 # Generated TypeScript types
├── server-alt.js          # Custom server with TypeScript support
├── ecosystem.config.js    # PM2 configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `cms/` directory:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
```

### Database Configuration
The default configuration uses SQLite for local development. To use PostgreSQL (e.g. your existing Supabase database):

1. Install the Postgres driver: `npm install pg` (already in the project).
2. In `.env`, set `DATABASE_CLIENT=postgres` and `DATABASE_URL` (see below). No need to change `config/database.ts`.

### Using the same Supabase Postgres as the backend
To point Strapi at your **existing Supabase** project (same DB as the website backend):

1. **Get the connection string** from [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** (gear) → **Database** → **Connection string** → **URI** tab. Use **Session mode** (pooler, port 5432) for reliability (e.g. from Render or other hosts).
2. Copy the URI. It looks like:  
   `postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres`  
   Replace `[YOUR-PASSWORD]` with your database password. If the URI doesn’t include `?sslmode=require`, add it.
3. In `cms/.env` set:
   ```env
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-xx.pooler.supabase.com:5432/postgres?sslmode=require
   ```
4. Keep your other Strapi env vars (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, etc.). Don’t remove them.
5. Run `npm run build` then start Strapi (`npm run develop` or `npm run start:alt`). On first run against this DB, Strapi will create its tables in the `public` schema alongside your existing backend tables. You’ll see the **registration page** once—create your admin user, then in **Settings → Users & Permissions → Roles → Public** enable **find** and **findOne** for **Program**, and **find** for **Top Banner** (site-wide announcement banner).

## 🚨 Troubleshooting

### Common Issues

#### 1. "Strapi was not found in the project dependencies"
**Solution:** Make sure you're in the `cms/` directory when running commands.

#### 2. "Admin panel not found" or "Cannot GET /admin"
**Solution:** Run `npm run build` to build the admin panel frontend.

#### 3. "PM2 command not found"
**Solution:** Install PM2 globally:
```bash
npm install -g pm2
```
Or use the local version with `npx pm2` commands.

#### 4. Port 1337 already in use
**Solution:** Check what's using the port:
```bash
lsof -i :1337
```
Kill the process or change the port in `config/server.ts`.

#### 5. TypeScript compilation errors
**Solution:** Ensure you're using the custom server commands:
```bash
npm run start:alt    # Instead of npm run start
npm run pm2:start    # For PM2 management
```

### Debug Mode
To see detailed logs, check PM2 logs:
```bash
npm run pm2:logs
```

## 📱 Admin Panel

### First Time Setup
1. Visit [http://localhost:1337/admin](http://localhost:1337/admin)
2. Create your first admin user
3. Configure your content types and permissions

### Content Management
- **Content Types:** Define your data structure
- **Media Library:** Manage images and files
- **Users & Permissions:** Control access to your API
- **Settings:** Configure your application

## 🔄 Development Workflow

1. **Start development:**
   ```bash
   npm run pm2:start
   ```

2. **Make changes** to your content types, components, or API

3. **Restart if needed:**
   ```bash
   npm run pm2:restart
   ```

4. **View logs:**
   ```bash
   npm run pm2:logs
   ```

5. **Stop development:**
   ```bash
   npm run pm2:stop
   ```

## 🚀 Deployment

### Can the CMS run on Vercel?

**No.** Strapi is a long-running Node.js server and is not compatible with Vercel’s serverless model:

- Vercel runs **stateless, on-demand functions** with no persistent process.
- Strapi expects a **persistent process**, a **database** (e.g. PostgreSQL or SQLite), and often a **writable filesystem** for uploads.
- There is no supported way to run the full Strapi admin + API as a serverless app on Vercel.

**Recommended setup:** Keep the Strapi CMS on a platform that supports long-running Node apps, and host your frontend on Vercel. Your frontend already uses `VITE_CMS_URL` to point at the CMS; set that in Vercel to your Render (or other) CMS URL.

### Good hosting options for the CMS

| Platform        | Notes |
|----------------|-------|
| **Render**     | What you use now; supports persistent Node + PostgreSQL. |
| **Strapi Cloud** | Official PaaS for Strapi; minimal config. |
| **Railway**    | Simple Node + Postgres; similar to Render. |
| **Fly.io**     | Global regions; good for low latency. |
| **DigitalOcean App Platform** | Managed app + DB. |

### Frontend on Vercel + CMS elsewhere

1. Deploy the **frontend** from `apps/frontend` to Vercel (you already have `apps/frontend/vercel.json`).
2. In Vercel, set **Environment variable**: `VITE_CMS_URL` = your CMS URL (e.g. `https://your-cms.onrender.com`).
3. Optional: In Strapi, add a **webhook** that calls a [Vercel Deploy Hook](https://vercel.com/docs/deployments/deploy-hooks) so the frontend redeploys when you publish content.

### Strapi Cloud

This project is configured for Strapi Cloud deployment. The TypeScript setup and custom server configuration ensure compatibility.

### Other platforms (Render, Railway, etc.)

Ensure:

- Environment variables are set (e.g. `DATABASE_URL` for Postgres, `APP_KEYS`, `PUBLIC_URL`, etc.).
- Database is configured (Postgres recommended in production; SQLite is not suitable on ephemeral servers).
- Build completes: `npm run build` then `npm run start` (or your platform’s start command).

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi TypeScript Guide](https://docs.strapi.io/cms/typescript)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

## 🤝 Contributing

1. Make changes in the `src/` directory
2. Test your changes locally
3. Ensure the build process completes successfully
4. Update this guide if needed

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review PM2 logs: `npm run pm2:logs`
3. Check Strapi documentation
4. Contact the development team

---

**Happy coding! 🎉**
