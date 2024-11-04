const pool = require('../config/db');

// Store technician location in the database
exports.storeLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const technicianId = req.user.id; // Extract technician ID from JWT

  try {
    // Insert location into the database
    await pool.query(
      'INSERT INTO locations (technician_id, latitude, longitude) VALUES ($1, $2, $3)',
      [technicianId, latitude, longitude]
    );
    res.status(201).json({ message: 'Location saved successfully' });
  } catch (err) {
    console.error('Error inserting into locations:', err);
    res.status(500).json({ error: 'Failed to save location' });
  }
};

// Get all locations (for admin use)
exports.getLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};
