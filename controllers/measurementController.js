// Assuming you have set up your PostgreSQL pool
const pool = require('../config/db'); // Update the path according to your project structure

// Submit a new mirror measurement
// Submit a new mirror measurement
exports.submitMirrorMeasurement = async (req, res) => {
  const { location, lot, measurementData } = req.body;

  // Log to confirm if req.user is accessible here
  console.log('User ID in controller:', req.user ? req.user.id : 'undefined');

  if (!req.user || !req.user.id) {
    return res.status(403).json({ error: 'User ID not found in token' });
  }

  try {
    await pool.query(
      'INSERT INTO mirrors (location, lot, measurement_data, technician_id) VALUES ($1, $2, $3, $4)',
      [location, lot, measurementData, req.user.id]
    );
    res.status(201).json({ message: 'Mirror measurement submitted successfully' });
  } catch (error) {
    console.error('Error submitting mirror measurement:', error);
    res.status(500).json({ error: 'Failed to submit mirror measurement' });
  }
};

exports.getMeasurements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM measurements');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to retrieve measurements' });
  }
};

// Submit a new shower measurement
exports.submitShowerMeasurement = async (req, res) => {
  const { location, lotNumber, neighborhood, measurementData } = req.body;

  try {
    // Insert shower measurement data into the showers table
    await pool.query(
      'INSERT INTO showers (location, lot_number, neighborhood, measurement_data, technician_id) VALUES ($1, $2, $3, $4, $5)',
      [location, lotNumber, neighborhood, measurementData, req.user.id]
    );
    res.status(201).json({ message: 'Shower measurement submitted successfully' });
  } catch (error) {
    console.error('Error submitting shower measurement:', error);
    res.status(500).json({ error: 'Failed to submit shower measurement' });
  }
};

// Get all mirror measurements (Admin-only)
exports.getMirrorMeasurements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mirrors');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching mirror measurements:', error);
    res.status(500).json({ error: 'Failed to retrieve mirror measurements' });
  }
};

// Get all shower measurements (Admin-only)
exports.getShowerMeasurements = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM showers');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching shower measurements:', error);
    res.status(500).json({ error: 'Failed to retrieve shower measurements' });
  }
};