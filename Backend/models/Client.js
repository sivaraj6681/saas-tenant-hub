// backend/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: String,
  email: String,
  phone: String,
  notes: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  subscriptionPlan: {
    type: String,
    enum: ['Free', 'Basic', 'Pro', 'Enterprise'],
    default: 'Free'
  }
}, {
  timestamps: true // includes createdAt and updatedAt
});

module.exports = mongoose.model('Client', clientSchema);
