const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  rfidTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RfidTag',
    required: true
  },
  uid: {
    type: String,
    required: true,
    uppercase: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    default: null
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  readerId: {
    type: String,
    default: 'SIMULATOR'
  },
  action: {
    type: String,
    enum: ['check-in', 'check-out', 'inventory', 'locate', 'unknown'],
    default: 'inventory'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

scanSchema.index({ createdAt: -1 });
scanSchema.index({ uid: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);