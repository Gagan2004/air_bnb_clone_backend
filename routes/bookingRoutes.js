const express = require('express');
const router = express.Router();

const { 
  createBooking, 
  getUserBookings, 
  getHostBookings, 
  getBookingById,
  cancelBooking ,
  updateBookingStatus
} = require('../controllers/bookingController');

const protect  = require('../middleware/authMiddleware');


router.post('/',   protect, createBooking);     // book a property
router.get('/',    protect, getUserBookings);   // my bookings
router.get('/host',protect, getHostBookings);   // bookings for my properties
router.get('/:id', protect, getBookingById);   // ← GET single booking
router.patch('/:id',protect ,updateBookingStatus)
router.delete('/:id', protect, cancelBooking);  // cancel my booking


module.exports = router;
