const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const axios=require("axios");
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: 'pass@word1',  // Your MySQL password
  database: 'job_app'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

  
  app.get('/jobs', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/jobs');
      res.send(response.data);
    } catch (err) {
      throw err;
    }
  });

  app.get('/jobs/:jobId', async (req, res) => {
    const jobId = req.params.jobId; // Extract jobId from request parameters
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/jobs/${jobId}`);
        res.send(response.data);
    } catch (err) {
        throw err;
    }
  });

  app.get('/applicants', (req, res) => {
    const sql = 'SELECT * FROM applicants';
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get('/applicants/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    const sql = 'SELECT * FROM applicants WHERE jobId = ?';
  
    db.query(sql, [jobId], (err, result) => {
      if (err) {
        throw err;
      }
      
      if (result.length === 0) {
        return res.send({ message: 'No applicants found for this job.' });
      }
  
      res.send(result);
    });
  });
  
  app.post('/applicants', (req, res) => {
    const { userId, jobId, name, email, education, experience, skills, resumeLink } = req.body;
  
    if (!userId || !jobId || !name || !email) {
      return res.status(400).send({ error: 'userId, jobId, name, and email are required fields.' });
    }
  
    const sql = `INSERT INTO applicants (userId, jobId, name, email, education, experience, skills, resumeLink)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [userId, jobId, name, email, education, experience, skills, resumeLink];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        throw err;
      }
  
      res.status(201).send({ message: 'Applicant added successfully!', applicantId: result.insertId });
    });
  });
  
  

  app.put('/applicants/:jobId/:id', (req, res) => {
    const { jobId, id } = req.params; 
    const { userId, name, email, education, experience, skills, resumeLink } = req.body;

    const sql = `UPDATE applicants SET 
        userId = ?, 
        name = ?, 
        email = ?, 
        education = ?, 
        experience = ?, 
        skills = ?, 
        resumeLink = ? 
      WHERE jobId = ? AND id = ?`;

    const values = [userId, name, email, education, experience, skills, resumeLink, jobId, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            throw err;
        }

        if (result.affectedRows === 0) {
            return res.send({ error: 'Applicant not found.' });
        }

        res.send({ message: 'Applicant updated successfully!' });
    });
});


app.delete('/applicants/:jobId/:id', (req, res) => {
    const { jobId, id } = req.params;

    const sql = `DELETE FROM applicants WHERE jobId = ? AND id = ?`;

    db.query(sql, [jobId, id], (err, result) => {
        if (err) {
            throw err;
        }

        if (result.affectedRows === 0) {
            return res.send({ error: 'Applicant not found.' });
        }

        res.send({ message: 'Applicant deleted successfully!' });
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });