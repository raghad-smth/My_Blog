require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL || 'postgres://localhost/my_database',
      ssl: {
        rejectUnauthorized: false, // Necessary for some hosting environments
      },
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
