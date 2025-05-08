const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByProperty,
} = require('../controllers/reviewController');

router.post('/:propertyId', createReview);
router.get('/:propertyId', getReviewsByProperty);

module.exports = router;
