const mongoose = require('mongoose');

const acknowledgmentLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  medicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',  // Reference to the Medication model
    required: true,
  },
  status: {
    type: String,
    enum: ['acknowledged', 'not acknowledged'],  // Two possible statuses
    default: 'acknowledged',  // Set default to 'acknowledged'
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,  // Automatically set to the current date and time
  },
});

const AcknowledgmentLog = mongoose.model('AcknowledgmentLog', acknowledgmentLogSchema);

module.exports = AcknowledgmentLog;
