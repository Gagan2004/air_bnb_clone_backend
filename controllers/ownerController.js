// controllers/ownerController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

async function _getOwnerProperties(req, res, next) {
  try {
    // req.user is guaranteed by protect()
    const ownerId = req.user.id;
    const properties = await prisma.property.findMany({
      where: { userId: ownerId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ properties });
  } catch (err) {
    next(err);
  }
}

async function _getRentalHistory(req, res, next) {
  try {
    const ownerId = req.user.id;
    // Find all bookings for properties owned by this user
    const bookings = await prisma.booking.findMany({
      where: {
        property: { userId: ownerId }
      },
      include: {
        property: { select: { id: true, title: true } },
        user:     { select: { id: true, name: true, email: true } }
      }
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // This array means: first run protect, then requireRole('OWNER'), then your handler.
  getOwnerProperties: [
    protect,
    requireRole('OWNER'),
    _getOwnerProperties
  ],

  getRentalHistory: [
    protect,
    requireRole('OWNER'),
    _getRentalHistory
  ]
};
