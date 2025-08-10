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
│   │   └── program/      # Program content type
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
The default configuration uses SQLite for local development. To use PostgreSQL:

1. Update `config/database.ts`
2. Install PostgreSQL dependencies: `npm install pg`
3. Set database environment variables

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

### Strapi Cloud
This project is configured for Strapi Cloud deployment. The TypeScript setup and custom server configuration ensure compatibility.

### Other Platforms
For other deployment platforms, ensure:
- Environment variables are properly set
- Database connection is configured
- Build process completes successfully

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
