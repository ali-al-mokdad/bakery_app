const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultipleImages, deleteImage } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/image', authMiddleware, upload.single('image'), uploadImage);
router.post('/multiple', authMiddleware, upload.array('images', 20), uploadMultipleImages);
router.delete('/:filename', authMiddleware, deleteImage);

module.exports = router;
