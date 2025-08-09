import path from 'path';

export default ({ env }) => {
  // Use PostgreSQL in production, SQLite in development
  if (env('NODE_ENV') === 'production') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('PGHOST', 'localhost'),
          port: env.int('PGPORT', 5432),
          database: env('PGDATABASE', 'strapi'),
          user: env('PGUSER', 'strapi'),
          password: env('PGPASSWORD', 'password'),
          ssl: env.bool('DATABASE_SSL', false),
        },
        debug: false,
      },
    };
  }
  
  // Development - SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
