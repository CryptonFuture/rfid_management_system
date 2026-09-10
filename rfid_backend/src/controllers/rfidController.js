const RfidTag = require('../models/RfidTag');
const Asset = require('../models/Asset');
const Scan = require('../models/Scan');

// @desc    Get all RFID tags
// @route   GET /api/rfid
// @access  Private
exports.getTags = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.uid = { $regex: search, $options: 'i' };
    }

    const tags = await RfidTag.find(query)
      .populate('asset', 'name serialNumber status')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await RfidTag.countDocuments(query);

    res.json({
      success: true,
      count: tags.length,
      total,
      pages: Math.ceil(total / limit),
      data: tags
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single tag
// @route   GET /api/rfid/:id
// @access  Private
exports.getTag = async (req, res) => {
  try {
    const tag = await RfidTag.findById(req.params.id)
      .populate('asset')
      .populate('createdBy', 'name');

    if (!tag) {
      return res.status(404).json({ success: false, message: 'RFID Tag not found' });
    }

    res.json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create RFID tag
// @route   POST /api/rfid
// @access  Private
exports.createTag = async (req, res) => {
  try {
    const { uid, type, notes } = req.body;

    const exists = await RfidTag.findOne({ uid: uid.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'RFID UID already exists' });
    }

    const tag = await RfidTag.create({
      uid: uid.toUpperCase(),
      type,
      notes,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update RFID tag
// @route   PUT /api/rfid/:id
// @access  Private
exports.updateTag = async (req, res) => {
  try {
    let tag = await RfidTag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'RFID Tag not found' });
    }

    // Prevent changing UID if already assigned
    if (req.body.uid && req.body.uid !== tag.uid && tag.status === 'assigned') {
      return res.status(400).json({ success: false, message: 'Cannot change UID of assigned tag' });
    }

    tag = await RfidTag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('asset', 'name');

    res.json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete RFID tag
// @route   DELETE /api/rfid/:id
// @access  Private (Admin)
exports.deleteTag = async (req, res) => {
  try {
    const tag = await RfidTag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'RFID Tag not found' });
    }

    if (tag.status === 'assigned') {
      return res.status(400).json({ success: false, message: 'Cannot delete assigned tag. Unassign first.' });
    }

    await tag.deleteOne();
    res.json({ success: true, message: 'RFID Tag deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate / Process RFID Scan
// @route   POST /api/rfid/scan
// @access  Private or Public (for hardware)
exports.processScan = async (req, res) => {
  try {
    const { uid, readerId = 'WEB-SIM', action = 'inventory', locationId, notes } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: 'UID is required' });
    }

    const tag = await RfidTag.findOne({ uid: uid.toUpperCase() }).populate('asset');
    
    if (!tag) {
      // Create scan record for unknown tag
      const scan = await Scan.create({
        rfidTag: null,
        uid: uid.toUpperCase(),
        readerId,
        action: 'unknown',
        notes: notes || 'Unknown tag scanned',
        scannedBy: req.user ? req.user.id : null
      });
      return res.status(404).json({
        success: false,
        message: 'RFID Tag not registered in system',
        data: { scan, known: false }
      });
    }

    // Update tag stats
    tag.lastScanned = new Date();
    tag.scanCount += 1;
    await tag.save();

    // Create scan record
    const scan = await Scan.create({
      rfidTag: tag._id,
      uid: tag.uid,
      asset: tag.asset ? tag.asset._id : null,
      location: locationId || (tag.asset ? tag.asset.location : null),
      scannedBy: req.user ? req.user.id : null,
      readerId,
      action,
      notes
    });

    const populatedScan = await Scan.findById(scan._id)
      .populate('rfidTag', 'uid status')
      .populate('asset', 'name serialNumber status category')
      .populate('location', 'name')
      .populate('scannedBy', 'name');

    res.json({
      success: true,
      message: 'Scan processed successfully',
      data: {
        known: true,
        tag,
        scan: populatedScan
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get scan history
// @route   GET /api/rfid/scans
// @access  Private
exports.getScans = async (req, res) => {
  try {
    const { page = 1, limit = 30, uid } = req.query;
    const query = {};
    if (uid) query.uid = uid.toUpperCase();

    const scans = await Scan.find(query)
      .populate('rfidTag', 'uid')
      .populate('asset', 'name serialNumber')
      .populate('location', 'name')
      .populate('scannedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Scan.countDocuments(query);

    res.json({
      success: true,
      count: scans.length,
      total,
      pages: Math.ceil(total / limit),
      data: scans
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};