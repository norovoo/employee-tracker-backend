const pool = require('../config/db');

// Example: Fetch all locations
exports.getAllLocations = async () => {
  const result = await pool.query('SELECT * FROM locations ORDER BY timestamp DESC');
  return result.rows;
};
