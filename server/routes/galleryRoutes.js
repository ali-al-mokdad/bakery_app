const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const { optionalAuth } = authMiddleware;

router.get('/', optionalAuth, getGalleryItems);
router.put('/reorder', authMiddleware, reorderGalleryItems);
router.get('/:id', getGalleryItemById);
router.post('/', authMiddleware, createGalleryItem);
router.put('/:id', authMiddleware, updateGalleryItem);
router.delete('/:id', authMiddleware, deleteGalleryItem);

module.exports = router;
