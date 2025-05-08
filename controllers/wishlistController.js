const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Toggle favorite (add/remove)

exports.toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const propertyId = req.params.propertyId;

  try {
    // Check if the favorite record exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId,
        },
      },
    });

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_propertyId: {
            userId: userId,
            propertyId: propertyId,
          },
        },
      });
      res.json({ message: "Removed from wishlist" });
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId: userId,
          propertyId: propertyId,
        },
      });
      res.json({ message: "Added to wishlist" });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Wishlist operation failed", error: error.message });
  }
};
// Get all favorite properties
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};
