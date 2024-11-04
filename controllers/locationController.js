const pool = require('../config/db'); // Ensure you have your database connection set up
const { body, validationResult } = require('express-validator'); // For input validation

// Store technician location
exports.storeLocation = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { latitude, longitude } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await pool.query(
      'INSERT INTO locations (technician_id, latitude, longitude) VALUES ($1, $2, $3)',
      [req.user.id, latitude, longitude]
    );
    res.status(201).json({ message: 'Location saved successfully' });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ error: 'Failed to save location' });
  }
};

// Get all locations (admin-only route)
exports.getLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};