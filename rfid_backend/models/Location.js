const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  building: {
    type: String,
    trim: true,
    default: ''
  },
  floor: {
    type: String,
    trim: true,
    default: ''
  },
  room: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);