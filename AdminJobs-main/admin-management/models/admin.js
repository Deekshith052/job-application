const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  jobId: { type: Number, required: true, unique: true },
  jobDescription: { type: String, required: true },
  workExpereince: { type: String, required: true },
  location: { type: String, required: true },

});

module.exports = mongoose.model('Admin', adminSchema);