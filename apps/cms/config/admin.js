export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  // Configure rich text editor behavior
  editor: {
    enabled: true,
    config: {
      // Remove extra paragraph spacing
      formats: {
        paragraph: {
          margin: '0 0 0.5em 0',
        }
      }
    }
  }
});
