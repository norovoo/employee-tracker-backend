const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Your database configuration

// Register a technician or admin
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user data into the database
    const result = await pool.query(
      'INSERT INTO technicians (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, role]
    );

    if (result.rows.length > 0) {
      // Return success message and user ID
      return res.status(201).json({ message: 'Registration successful', id: result.rows[0].id });
    } else {
      return res.status(500).json({ error: 'Failed to register technician' });
    }
  } catch (err) {
    console.error('Error inserting into technicians:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Login a technician or admin
exports.login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password

  try {
    // Query to find the technician by email
    const result = await pool.query('SELECT * FROM technicians WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // If no technician is found
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const technician = result.rows[0];

    // Check if the provided password matches the hashed password
    const isMatch = await bcrypt.compare(password, technician.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token with user ID and role
    const token = jwt.sign(
      { id: technician.id, role: technician.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token in the response
    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};