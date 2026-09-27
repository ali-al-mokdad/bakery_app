const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { deleteUploadedFile } = require('../utils/fileUtils');

// GET /api/menu - public: visible + available items by default; admins (req.user) get everything
// Query params: category, search, all=true (admin only)
const getMenuItems = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const isAdminRequest = Boolean(req.user) && req.query.all === 'true';

  const where = {};

  if (!isAdminRequest) {
    where.isVisible = true;
  }

  if (category && category !== 'all') {
    where.categoryId = Number(category);
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term } },
      { description: { contains: term } },
      { category: { name: { contains: term } } },
    ];
  }

  const items = await prisma.menuItem.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
    include: { category: true },
  });

  res.json(items);
});

// GET /api/menu/:id
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await prisma.menuItem.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });
  if (!item) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json(item);
});

// POST /api/menu (protected)
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, image, categoryId, isAvailable, isFeatured, isVisible } =
    req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Product name is required.' });
  }

  const maxOrder = await prisma.menuItem.aggregate({ _max: { displayOrder: true } });
  const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;

  const item = await prisma.menuItem.create({
    data: {
      name: name.trim(),
      description: description || null,
      price: price !== undefined && price !== null && price !== '' ? Number(price) : null,
      image: image || null,
      categoryId: categoryId ? Number(categoryId) : null,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      displayOrder: nextOrder,
    },
    include: { category: true },
  });
  res.status(201).json(item);
});

// PUT /api/menu/:id (protected)
const updateMenuItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const {
    name,
    description,
    price,
    image,
    categoryId,
    isAvailable,
    isFeatured,
    isVisible,
    displayOrder,
  } = req.body;

  if (image !== undefined && image !== existing.image && existing.image) {
    deleteUploadedFile(existing.image);
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name: name !== undefined ? name.trim() : undefined,
      description: description !== undefined ? description : undefined,
      price:
        price !== undefined ? (price === null || price === '' ? null : Number(price)) : undefined,
      image: image !== undefined ? image : undefined,
      categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : undefined,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
    },
    include: { category: true },
  });
  res.json(item);
});

// DELETE /api/menu/:id (protected)
const deleteMenuItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  await prisma.menuItem.delete({ where: { id } });

  if (existing.image) {
    deleteUploadedFile(existing.image);
  }

  res.json({ message: 'Product deleted successfully.' });
});

// PUT /api/menu/reorder (protected)
const reorderMenuItems = asyncHandler(async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order must be an array of { id, displayOrder }.' });
  }

  await prisma.$transaction(
    order.map((item) =>
      prisma.menuItem.update({
        where: { id: Number(item.id) },
        data: { displayOrder: Number(item.displayOrder) },
      })
    )
  );

  res.json({ message: 'Products reordered successfully.' });
});

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
};
