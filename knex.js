require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:mHKjXUMtzJwZknGJyyamACMhgyOoKJhw@postgres.railway.internal:5432/railway',
      ssl: {
        rejectUnauthorized: false, // Necessary for some hosting environments
      },
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL, // Ensure DATABASE_URL is set in your environment variables
      ssl: {
        rejectUnauthorized: false, // Necessary for some hosting environments
      },
    },
  },
};
