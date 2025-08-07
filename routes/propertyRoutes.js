// const express = require('express');
// const router = express.Router();
// const { createProperty } = require('../controllers/propertyController');
// const protect = require('../middleware/authMiddleware');

// router.post('/', createProperty);

// module.exports = router;




// routes/propertyRoutes.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router  = express.Router();
const protect = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');


const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty ,
  getUserProperties,
  deleteProperty , 
  searchProperties

  // (we’ll add others later)
} = require('../controllers/propertyController');

router.get('/me', protect,getUserProperties);


router
  .route('/')
  .get(getAllProperties)      // Public: anyone can view listings
  .post(protect, requireRole('OWNER','ADMIN'),  ...createProperty); // Protected: only logged-in users
  

// routes/propertyRoutes.js
router.post('/search', searchProperties);


  router.get('/search', async (req, res) => {
    const { location, price, guests, amenities } = req.query;
  
    const query = {};
    const where = {};

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
  
    // Price filter (≤)
    if (price) {
      where.price = { lte: parseFloat(price) };
    }
  
    // Guests filter (≥)
    if (guests) {
      where.guestCount = { gte: parseInt(guests) };
    }
  
    // Amenities filter (must include all)
    if (amenities) {
      const list = amenities.split(',').map(a => a.trim().toLowerCase());
      where.amenities = { hasEvery: list }; // Requires Prisma MongoDB connector ≥ 4.3
    }
  
    // Step 2: Execute the query
    try {
      const properties = await prisma.property.findMany({
        where, // Filters go here
      });
  
      res.json({ properties });
    } catch (err) {
      console.error('Prisma error:', err);
      res.status(500).json({ error: 'Search failed' });
    }

  
  });
  
  
  router
  .route('/:id')
  .get(getPropertyById)
  .put(protect,  requireRole('OWNER','ADMIN'), ...updateProperty);  // ← protected update






  router.delete('/:id', protect,  requireRole('OWNER','ADMIN'),  deleteProperty);





module.exports = router;

