const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { optionalAuth } = authMiddleware;

router.get('/', optionalAuth, getCategories);
router.put('/reorder', authMiddleware, reorderCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
