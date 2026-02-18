import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const databaseUrl = env('DATABASE_URL');
  const isSupabaseOrCloud = databaseUrl && (databaseUrl.includes('supabase') || databaseUrl.includes('sslmode='));
  // Render/cloud: use smaller pool and longer timeout to avoid "Knex: Timeout acquiring a connection" on cold start
  const poolMin = env.int('DATABASE_POOL_MIN', databaseUrl ? 0 : 2);
  const poolMax = env.int('DATABASE_POOL_MAX', databaseUrl ? 5 : 10);
  const acquireTimeout = env.int('DATABASE_CONNECTION_TIMEOUT', databaseUrl ? 90000 : 60000);

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: poolMin, max: poolMax },
    },
    postgres: {
      connection: (() => {
        const base = {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          schema: env('DATABASE_SCHEMA', 'public'),
        };
        // Supabase/cloud: use SSL but do not verify server cert (avoids "self-signed certificate" errors).
        // Strip sslmode from URL so pg doesn't apply verify-full from the query string; we set ssl ourselves.
        if (isSupabaseOrCloud) {
          const urlWithoutSslMode = databaseUrl.replace(/\?sslmode=[^&]+&?|&sslmode=[^&]+/gi, '').replace(/\?$/, '');
          return {
            ...base,
            connectionString: urlWithoutSslMode,
            ssl: { rejectUnauthorized: false },
          };
        }
        if (databaseUrl) {
          return { ...base, connectionString: databaseUrl, ssl: env.bool('DATABASE_SSL', true) && { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true) } };
        }
        return {
          ...base,
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
        };
      })(),
      pool: { min: poolMin, max: poolMax },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: acquireTimeout,
    },
  };
};
