const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// GET /api/admin/properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: { user: { select: { id: true, name: true } } }
    });
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};

// PATCH /api/admin/properties/:id
exports.togglePropertyStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  const updated = await prisma.property.update({
    where: { id },
    data: { active }
  });
  res.json({ property: updated });
};


// GET /api/admin/metrics
exports.getMetrics = async (req, res) => {
  try {
    const activeListings = await prisma.property.count({ where: { active: true } });
    const totalBookings   = await prisma.booking.count();
    // const flaggedCount    = await prisma.review.count({ where: { flagged: true } });

    res.json({ activeListings, totalBookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch metrics', error: error.message });
  }
};
