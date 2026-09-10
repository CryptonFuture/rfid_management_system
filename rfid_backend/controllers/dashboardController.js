const Asset = require('../models/Asset');
const RfidTag = require('../models/RfidTag');
const Scan = require('../models/Scan');
const Location = require('../models/Location');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalAssets,
      availableAssets,
      inUseAssets,
      totalTags,
      assignedTags,
      availableTags,
      totalScans,
      recentScans,
      totalLocations,
      assetsByCategory,
      assetsByStatus
    ] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'available' }),
      Asset.countDocuments({ status: 'in-use' }),
      RfidTag.countDocuments(),
      RfidTag.countDocuments({ status: 'assigned' }),
      RfidTag.countDocuments({ status: 'available' }),
      Scan.countDocuments(),
      Scan.find()
        .populate('asset', 'name')
        .populate('rfidTag', 'uid')
        .populate('scannedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      Location.countDocuments({ isActive: true }),
      Asset.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Asset.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Scans in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const scansLast7Days = await Scan.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      success: true,
      data: {
        overview: {
          totalAssets,
          availableAssets,
          inUseAssets,
          totalTags,
          assignedTags,
          availableTags,
          totalScans,
          scansLast7Days,
          totalLocations
        },
        recentScans,
        assetsByCategory: assetsByCategory.map(i => ({ category: i._id, count: i.count })),
        assetsByStatus: assetsByStatus.map(i => ({ status: i._id, count: i.count }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};