// const express = require('express');
// const router = express.Router();
// const { createProperty } = require('../controllers/propertyController');
// const protect = require('../middleware/authMiddleware');

// router.post('/', createProperty);

// module.exports = router;




// routes/propertyRoutes.js
const express = require('express');
const router  = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty ,
  getUserProperties,
  deleteProperty
  // (we’ll add others later)
} = require('../controllers/propertyController');

router.get('/me', protect,getUserProperties);


router
  .route('/')
  .get(getAllProperties)      // Public: anyone can view listings
  .post(protect, ...createProperty); // Protected: only logged-in users

  router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, ...updateProperty);  // ← protected update



  router.delete('/:id', protect, deleteProperty);





module.exports = router;

