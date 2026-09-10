const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAssets)
  .post(createAsset);

router.route('/:id')
  .get(getAsset)
  .put(updateAsset)
  .delete(authorize('admin'), deleteAsset);

module.exports = router;