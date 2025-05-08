// const jwt = require('jsonwebtoken');
// // const prisma = require('../prismaClient');
// const JWT_SECRET = process.env.JWT_SECRET;
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();


// const protect = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer token
//   if (!token) return res.status(401).json({ message: 'Not authorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token failed' });
//   }
// };

// module.exports = protect;

require('dotenv').config();

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  try {
    // console.log('req.headers:', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = protect;

