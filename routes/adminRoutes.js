const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// All routes require ADMIN role
router.use(protect, requireRole('ADMIN'));

// 1. Get all users
router.get('/users', adminController.getAllUsers);

// 2. Get all properties
router.get('/properties', adminController.getAllProperties);

// 3. Approve / Deactivate a listing
router.patch('/properties/:id', adminController.togglePropertyStatus);

// 4. Get metrics
router.get('/metrics', adminController.getMetrics);

module.exports = router;