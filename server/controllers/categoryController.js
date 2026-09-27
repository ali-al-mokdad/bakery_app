const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { deleteUploadedFile } = require('../utils/fileUtils');

// GET /api/categories - public: only visible categories, unless ?all=true and authenticated
const getCategories = asyncHandler(async (req, res) => {
  const showAll = req.query.all === 'true' && req.user;
  const categories = await prisma.category.findMany({
    where: showAll ? {} : { isVisible: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: { select: { menuItems: true } },
    },
  });
  res.json(categories);
});

// GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(req.params.id) },
    include: { menuItems: true },
  });
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.json(category);
});

// POST /api/categories (protected)
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, isVisible } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const maxOrder = await prisma.category.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      description: description || null,
      image: image || null,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      displayOrder: nextOrder,
    },
  });
  res.status(201).json(category);
});

// PUT /api/categories/:id (protected)
const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const { name, description, image, isVisible, displayOrder } = req.body;

  // If image changed, delete the old physical file
  if (image !== undefined && image !== existing.image && existing.image) {
    deleteUploadedFile(existing.image);
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: name !== undefined ? name.trim() : undefined,
      description: description !== undefined ? description : undefined,
      image: image !== undefined ? image : undefined,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
    },
  });
  res.json(category);
});

// DELETE /api/categories/:id (protected)
const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  await prisma.category.delete({ where: { id } });

  if (existing.image) {
    deleteUploadedFile(existing.image);
  }

  res.json({ message: 'Category deleted successfully.' });
});

// PUT /api/categories/reorder (protected) - body: { order: [{id, displayOrder}, ...] }
const reorderCategories = asyncHandler(async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order must be an array of { id, displayOrder }.' });
  }

  await prisma.$transaction(
    order.map((item) =>
      prisma.category.update({
        where: { id: Number(item.id) },
        data: { displayOrder: Number(item.displayOrder) },
      })
    )
  );

  res.json({ message: 'Categories reordered successfully.' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
};
