const pool = require('../config/db');

// Example of a query that fetches all technicians
exports.getAllTechnicians = async () => {
  const result = await pool.query('SELECT * FROM technicians');
  return result.rows;
};
