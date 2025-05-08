const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'airbnb_properties',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => Date.now() + '_' + file.originalname
  }
});

const parser = multer({ storage });
module.exports = parser;