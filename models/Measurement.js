const pool = require('../config/db');

// Example: Fetch all measurements
exports.getAllMeasurements = async () => {
  const result = await pool.query('SELECT * FROM measurements ORDER BY timestamp DESC');
  return result.rows;
};
