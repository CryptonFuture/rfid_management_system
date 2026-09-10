const Asset = require('../models/Asset');
const RfidTag = require('../models/RfidTag');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const assets = await Asset.find(query)
      .populate('location', 'name building floor room')
      .populate('rfidTag', 'uid status')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Asset.countDocuments(query);

    res.json({
      success: true,
      count: assets.length,
      total,
      pages: Math.ceil(total / limit),
      data: assets
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
exports.getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('location')
      .populate('rfidTag')
      .populate('createdBy', 'name email');

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create asset
// @route   POST /api/assets
// @access  Private
exports.createAsset = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const asset = await Asset.create(req.body);
    
    const populated = await Asset.findById(asset._id)
      .populate('location', 'name')
      .populate('rfidTag', 'uid');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
exports.updateAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    // Handle RFID tag assignment
    if (req.body.rfidTag && req.body.rfidTag !== asset.rfidTag?.toString()) {
      // Unassign previous tag if any
      if (asset.rfidTag) {
        await RfidTag.findByIdAndUpdate(asset.rfidTag, { status: 'available', asset: null });
      }
      // Assign new tag
      if (req.body.rfidTag) {
        await RfidTag.findByIdAndUpdate(req.body.rfidTag, { status: 'assigned', asset: asset._id });
      }
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('location', 'name').populate('rfidTag', 'uid status');

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private (Admin)
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    // Free the RFID tag
    if (asset.rfidTag) {
      await RfidTag.findByIdAndUpdate(asset.rfidTag, { status: 'available', asset: null });
    }

    await asset.deleteOne();
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};