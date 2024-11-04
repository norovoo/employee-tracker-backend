const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  console.log('Received token:', token);  // Log the token for debugging

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.error('Token verification error:', err);  // Log verification errors
      return res.status(403).json({ error: 'Invalid token' });
    }

    console.log('Decoded token:', decodedUser);  // Log decoded data structure

    if (!decodedUser || !decodedUser.id) {
      return res.status(403).json({ error: 'User ID not found in token' });
    }

    req.user = decodedUser; // Assign the decoded token data to req.user
    next();
  });
};