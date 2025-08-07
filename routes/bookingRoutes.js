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

const { requireRole } = require('../middleware/roleMiddleware');


router.post('/',protect ,requireRole('RENTER'), createBooking);     // book a property
router.get('/',protect,requireRole('RENTER'),getUserBookings);   // my bookings

router.get('/host',protect,getHostBookings);   // bookings for my properties

router.get('/:id', protect, getBookingById);   // ← GET single booking
router.patch('/:id',protect ,requireRole('OWNER','ADMIN'),updateBookingStatus)
router.delete('/:id', protect,requireRole('RENTER','ADMIN'),cancelBooking);  // cancel my booking


module.exports = router;
