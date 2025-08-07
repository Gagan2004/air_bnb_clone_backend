const express = require('express');
const router = express.Router();
const { requireRole } = require('../middleware/roleMiddleware');
const protect = require('../middleware/authMiddleware');


const {
  createReview,
  getReviewsByProperty,
} = require('../controllers/reviewController');

router.post('/:propertyId', protect, requireRole('RENTER'), createReview);
router.get('/:propertyId', getReviewsByProperty);

module.exports = router;
