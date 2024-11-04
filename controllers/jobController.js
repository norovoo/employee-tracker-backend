// controllers/jobController.js
const pool = require('../config/db'); // Update according to your database setup

exports.addJob = async (req, res) => {
  const { technicianId, jobTitle, jobDescription, startTime, endTime } = req.body;
  try {
    await pool.query(
      'INSERT INTO jobs (technician_id, job_title, job_description, start_time, end_time) VALUES ($1, $2, $3, $4, $5)',
      [technicianId, jobTitle, jobDescription, startTime, endTime]
    );
    res.status(201).json({ message: 'Job added successfully' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { jobTitle, jobDescription, startTime, endTime, status } = req.body;
  try {
    await pool.query(
      'UPDATE jobs SET job_title = $1, job_description = $2, start_time = $3, end_time = $4, status = $5 WHERE job_id = $6',
      [jobTitle, jobDescription, startTime, endTime, status, id]
    );
    res.status(200).json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM jobs WHERE job_id = $1', [id]);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};