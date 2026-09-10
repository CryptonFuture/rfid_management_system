const express = require('express');
const router = express.Router();
const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getLocations)
  .post(createLocation);

router.route('/:id')
  .put(updateLocation)
  .delete(authorize('admin'), deleteLocation);

module.exports = router;