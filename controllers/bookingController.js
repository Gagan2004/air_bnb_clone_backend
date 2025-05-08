const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. Create a booking
exports.createBooking = async (req, res) => {
  const { propertyId, startDate, endDate } = req.body;
  const userId = req.user.id;

  try {
    // Optional: check overlapping bookings
    const overlapping = await prisma.booking.findFirst({
      where: {
        propertyId,
        AND: [
          { startDate: { lte: new Date(endDate) } },
          { endDate:   { gte: new Date(startDate) } }
        ]
      }
    });
    if (overlapping) {
      return res.status(400).json({ message: 'Dates unavailable for this property' });
    }

    const booking = await prisma.booking.create({
      data: {
        propertyId,
        userId,
        startDate: new Date(startDate),
        endDate:   new Date(endDate),
        status:"CONFIRMED"
      }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// 2. Get bookings for current user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        property: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// 3. Get bookings for properties the user owns
exports.getHostBookings = async (req, res) => {
  try {
    // fetch all bookings where booking.property.userId === req.user.id
    const bookings = await prisma.booking.findMany({
      where: {
        property: { userId: req.user.id }
      },
      include: {
        property: true,
        user:     { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch host bookings', error: error.message });
  }
};

// 4. Cancel (delete) a booking
exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    await prisma.booking.delete({ where: { id } });
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

// 5. Get a single booking by ID (for ManageBooking page)
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
        user: { select: { id: true, name: true } }
      }
    });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};


exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
};


