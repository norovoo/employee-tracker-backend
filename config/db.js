// db.js
require('dotenv').config(); // Load environment variables from .env

const { Pool } = require('pg');

// Set up connection to PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,      // PostgreSQL username from .env
  host: process.env.DB_HOST,      // PostgreSQL host (localhost or AWS RDS in production)
  database: process.env.DB_NAME,  // Database name
  password: process.env.DB_PASSWORD, // PostgreSQL password from .env
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Export the pool for use in other parts of the app
module.exports = pool;

