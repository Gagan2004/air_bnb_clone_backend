// // routes/ownerRoutes.js
// const express = require('express');
// const router  = express.Router();
// const { protect }          = require('../middleware/authMiddleware');
// const { requireRole }      = require('../middleware/roleMiddleware');
// const ownerController      = require('../controllers/ownerController');

// // only OWNER (or ADMIN, if you like) may access:
// router.use(protect, requireRole('OWNER'));

// router.get('/properties',     ownerController.getOwnerProperties);
// router.get('/rental-history', ownerController.getRentalHistory);

// module.exports = router;




// routes/owner.js
const express = require('express');
const router  = express.Router();
const ownerController = require('../controllers/ownerController');

// no router.use here!  auth lives inside the controller export:
router.get('/properties',       ownerController.getOwnerProperties);
router.get('/rental-history',   ownerController.getRentalHistory);

module.exports = router;
