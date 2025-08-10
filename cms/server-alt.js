const strapi = require('@strapi/strapi');

// Use createStrapi with explicit distDir for TypeScript projects
const app = strapi.createStrapi({ 
  distDir: './dist'  // This is where Strapi compiles TypeScript code
});

app.start().then(() => {
  console.log('Strapi server started successfully');
}).catch(error => {
  console.error('Failed to start Strapi:', error);
});
