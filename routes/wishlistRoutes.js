const express = require('express');
const { toggleFavorite, getFavorites } = require('../controllers/wishlistController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/wishlist/:propertyId', protect, toggleFavorite);
router.get('/wishlist', protect, getFavorites);

module.exports = router;    
