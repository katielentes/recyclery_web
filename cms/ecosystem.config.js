module.exports = {
  apps: [
    {
      name: 'recyclery-cms',
      script: 'server-alt.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 1337
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1337
      }
    }
  ]
};
