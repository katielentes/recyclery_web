export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Production optimizations
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  // Enable CORS for production
  cors: {
    enabled: true,
    origin: env.array('CORS_ORIGIN', [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://recyclery-web-frontend-orpin.vercel.app',
      'https://recyclery-web-frontend.vercel.app',
      'https://recyclery-web-frontend-git-cms.vercel.app',
      'https://www.katielentes.dev',
      '*'
    ]),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  },
  // Production logging
  logger: {
    level: env('LOG_LEVEL', 'info'),
  },
});
