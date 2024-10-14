const express = require('express');
const router = express.Router();
const Admin = require('../models/admin'); // Import your Admin model

// 1. Fetch all jobs [GET]
router.get('/', async (req, res) => {
  try {
    const jobs = await Admin.find(); // Fetch all jobs
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Add a new job [POST]
router.post('/', async (req, res) => {
  const { jobId, jobDescription, workExpereince, location } = req.body;

  const newJob = new Admin({ // Create a new Admin instance
    jobId,
    jobDescription,
    workExpereince,
    location,
  });

  try {
    await newJob.save(); // Save the new job
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Fetch job by ID [GET]
router.get('/:id', async (req, res) => {
  try {
    const job = await Admin.findOne({ jobId: req.params.id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Update job details [PUT]
router.put('/:id', async (req, res) => {
  const { jobDescription, name, location } = req.body;

  try {
    const updatedJob = await Admin.findOneAndUpdate(
      { jobId: req.params.id },
      { jobDescription, name, location },
      { new: true }
    );

    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete job [DELETE]
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Admin.findOneAndDelete({ jobId: req.params.id });

    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
