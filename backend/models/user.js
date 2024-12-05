const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'admin'],  // Role can be either 'user' or 'admin'
    default: 'patient'
  }
});

// Method to check if the password matches
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);
