const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Furniture', 'Equipment', 'Vehicles', 'Tools', 'Documents', 'Other'],
    default: 'Other'
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  rfidTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RfidTag',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance', 'retired', 'lost'],
    default: 'available'
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number,
    min: 0
  },
  assignedTo: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
assetSchema.index({ name: 'text', serialNumber: 'text' });
assetSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Asset', assetSchema);