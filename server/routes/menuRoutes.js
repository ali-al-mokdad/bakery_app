const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
} = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');
const { optionalAuth } = authMiddleware;

router.get('/', optionalAuth, getMenuItems);
router.put('/reorder', authMiddleware, reorderMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', authMiddleware, createMenuItem);
router.put('/:id', authMiddleware, updateMenuItem);
router.delete('/:id', authMiddleware, deleteMenuItem);

module.exports = router;
