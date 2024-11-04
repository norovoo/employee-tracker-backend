const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/MeasurementController');

router.get('/', measurementController.getMeasurements); // GET route for measurements
router.post('/mirror', measurementController.submitMirrorMeasurement);
router.post('/shower', measurementController.submitShowerMeasurement); // POST route for shower measurements

module.exports = router;