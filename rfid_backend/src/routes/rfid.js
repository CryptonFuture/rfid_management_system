const express = require('express');
const router = express.Router();
const {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  processScan,
  getScans
} = require('../controllers/rfidController');
const { protect, authorize } = require('../middleware/auth');

// Public scan endpoint for hardware/Python simulator (optional auth)
router.post('/scan', processScan);

router.use(protect);

router.get('/scans', getScans);

router.route('/')
  .get(getTags)
  .post(createTag);

router.route('/:id')
  .get(getTag)
  .put(updateTag)
  .delete(authorize('admin'), deleteTag);

module.exports = router;