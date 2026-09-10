const mongoose = require('mongoose');

const rfidTagSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'RFID UID is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[0-9A-F]{8,24}$/, 'UID must be valid hexadecimal']
  },
  type: {
    type: String,
    enum: ['passive', 'active', 'semi-passive'],
    default: 'passive'
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'damaged', 'lost'],
    default: 'available'
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    default: null
  },
  lastScanned: {
    type: Date,
    default: null
  },
  scanCount: {
    type: Number,
    default: 0
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

rfidTagSchema.index({ uid: 1 });
rfidTagSchema.index({ status: 1 });

module.exports = mongoose.model('RfidTag', rfidTagSchema);