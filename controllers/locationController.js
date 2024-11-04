const pool = require('../config/db');

// Get all locations (for admins)
exports.getLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Error fetching locations' });
  }
};
