// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/', jobController.addJob); // Add a new job
router.get('/', jobController.getJobs); // Retrieve all jobs
router.put('/:id', jobController.updateJob); // Update job by ID
router.delete('/:id', jobController.deleteJob); // Delete job by ID

module.exports = router;