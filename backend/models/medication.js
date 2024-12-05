// Medication model (Medication.js)
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  scheduleTime: [{
    time: {
      type: String,
      required: true
    },

  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAcknowledged: {  // Add this field to track acknowledgment status
    type: Boolean,
    default: false,
  }
});

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;
