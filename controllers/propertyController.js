  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const parser = require('../middleware/upload');


  // exports.createProperty = async (req, res) => {
  //   const { title, description  , image, price, location } = req.body;
  //   try {
  //     const property = await prisma.property.create({
  //       data: {
  //         title,
  //         description,
  //         image,
  //         price,
  //         location,
  //         userId: req.user.id, // from auth middleware
  //       },
  //     });
  //     res.status(201).json(property);
  //   } catch (error) {
  //     console.error("🛠️ createProperty payload:", req.body);
  //     console.error("🔥 createProperty error:", error);
  //     res
  //       .status(500)
  //       .json({ message: "Failed to create property", error: error.message });
  //   }
  // };


  exports.createProperty = [parser.array('images', 5), async (req, res) => {
    try {
      const urls = req.files.map(f => f.path);
      const { title, description, price, location } = req.body;
      const property = await prisma.property.create({
        data: {
          title,
          description,
          price: Number(price),
          location,
          images: urls,
          userId: req.user.id,
        },
      });
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create property', error: error.message });
    }
  }];



  // controllers/propertyController.js

  exports.getAllProperties = async (req, res) => {
    try {
      // Pagination defaults
      // console.log(prisma);
      const page  = parseInt(req.query.page)  || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip  = (page - 1) * limit;

      // Optional filters
      const filters = {};
      if (req.query.location) {
        filters.location = { contains: req.query.location, mode: 'insensitive' };
      }
      if (req.query.minPrice || req.query.maxPrice) {
        filters.price = {};
        if (req.query.minPrice) filters.price.gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filters.price.lte = Number(req.query.maxPrice);
      }

      const [total, properties] = await Promise.all([
        prisma.property.count({ where: filters }),
        prisma.property.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      res.json({
        page,
        totalPages: Math.ceil(total / limit),
        total,
        properties,
      });

    } catch (error) {

      res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
    }
  };


  exports.getPropertyById = async (req, res) => {
    const { id } = req.params;

    try {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch property', error: error.message });
    }
  };


  // exports.updateProperty = async (req, res) => {
  //   const { id } = req.params;
  //   const updates = req.body; // e.g. { title, price, location, ... }

  //   try {
  //     // 1) Fetch the existing property
  //     const existing = await prisma.property.findUnique({ where: { id } });
  //     if (!existing) {
  //       return res.status(404).json({ message: 'Property not found' });
  //     }

  //     // 2) Check ownership
  //     if (existing.userId !== req.user.id) {
  //       return res.status(403).json({ message: 'Not authorized to update this property' });
  //     }

  //     // 3) Perform the update
  //     const updated = await prisma.property.update({
  //       where: { id },
  //       data: updates,
  //     });

  //     res.json(updated);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Failed to update property', error: error.message });
  //   }
  // };

  exports.updateProperty = [parser.array('images', 5), async (req, res) => {
    const { id } = req.params;
    try {
      const existing = await prisma.property.findUnique({ where: { id } });
      if (existing.userId !== req.user.id) return res.status(403).end();
  
      // new uploads append
      const newUrls = req.files.map(f => f.path);
      const data = {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined,
        images: existing.images.concat(newUrls),
      };
  
      const updated = await prisma.property.update({ where: { id }, data });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update property', error: error.message });
    }
  }];


  exports.deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
      // Find the property first
      const property = await prisma.property.findUnique({
        where: { id }
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Check if the logged-in user owns the property
      if (property.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this property" });
      }

      // Delete the property
      await prisma.property.delete({
        where: { id }
      });

      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property", error: error.message });
    }
  };


  exports.getUserProperties = async (req, res) => {
    try {
      const properties = await prisma.property.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch user properties',
        error: error.message,
      });
    }
  };




