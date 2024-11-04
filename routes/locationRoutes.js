const express = require('express');
const locationController = require('../controllers/locationController'); // Ensure this path is correct
const { authenticateToken } = require('../middleware/authMiddleware'); // Ensure the middleware is correct
const router = express.Router();

// POST route for technicians to submit their location
router.post('/', authenticateToken, locationController.storeLocation); // Ensure storeLocation function exists

// GET route for admins to retrieve technician locations
router.get('/', authenticateToken, locationController.getLocations); // Ensure getLocations function exists

module.exports = router;
