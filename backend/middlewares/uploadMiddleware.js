const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tour_trip_management',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
        // Optionally transformations can be applied here
        // transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

// Init upload with Cloudinary storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10MB limit
});

module.exports = upload;
