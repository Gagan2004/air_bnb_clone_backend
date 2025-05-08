const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Review
exports.createReview = async (req, res) => {
  const { propertyId } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        propertyId,
      },
    });

    res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

// Get All Reviews for a Property
exports.getReviewsByProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};
    