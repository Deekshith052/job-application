const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin router

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection (use your local MongoDB URI here)
mongoose.connect('mongodb://0.0.0.0:27017/jobManagement', { // Update the database name
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Routes
app.use('/api/v1/jobs', adminRoutes); // Update the route to use admin routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
