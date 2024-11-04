const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET all locations
router.get('/', locationController.getLocations);

module.exports = router;
