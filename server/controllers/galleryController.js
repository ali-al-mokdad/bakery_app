const prisma = require('../utils/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { deleteUploadedFile } = require('../utils/fileUtils');

// GET /api/gallery - public: visible only, unless admin (?all=true and authenticated)
const getGalleryItems = asyncHandler(async (req, res) => {
  const showAll = req.query.all === 'true' && req.user;
  const items = await prisma.gallery.findMany({
    where: showAll ? {} : { isVisible: true },
    orderBy: { displayOrder: 'asc' },
  });
  res.json(items);
});

// GET /api/gallery/:id
const getGalleryItemById = asyncHandler(async (req, res) => {
  const item = await prisma.gallery.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) {
    return res.status(404).json({ message: 'Gallery image not found.' });
  }
  res.json(item);
});

// POST /api/gallery (protected) - supports single image object or array for bulk upload
const createGalleryItem = asyncHandler(async (req, res) => {
  const { image, images, caption, isVisible } = req.body;

  const maxOrder = await prisma.gallery.aggregate({ _max: { displayOrder: true } });
  let nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;

  if (Array.isArray(images) && images.length > 0) {
    const created = await prisma.$transaction(
      images.map((img, idx) =>
        prisma.gallery.create({
          data: {
            image: img,
            caption: caption || null,
            isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
            displayOrder: nextOrder + idx,
          },
        })
      )
    );
    return res.status(201).json(created);
  }

  if (!image) {
    return res.status(400).json({ message: 'Image is required.' });
  }

  const item = await prisma.gallery.create({
    data: {
      image,
      caption: caption || null,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      displayOrder: nextOrder,
    },
  });
  res.status(201).json(item);
});

// PUT /api/gallery/:id (protected)
const updateGalleryItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Gallery image not found.' });
  }

  const { image, caption, isVisible, displayOrder } = req.body;

  if (image !== undefined && image !== existing.image && existing.image) {
    deleteUploadedFile(existing.image);
  }

  const item = await prisma.gallery.update({
    where: { id },
    data: {
      image: image !== undefined ? image : undefined,
      caption: caption !== undefined ? caption : undefined,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
    },
  });
  res.json(item);
});

// DELETE /api/gallery/:id (protected)
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: 'Gallery image not found.' });
  }

  await prisma.gallery.delete({ where: { id } });

  if (existing.image) {
    deleteUploadedFile(existing.image);
  }

  res.json({ message: 'Gallery image deleted successfully.' });
});

// PUT /api/gallery/reorder (protected)
const reorderGalleryItems = asyncHandler(async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order must be an array of { id, displayOrder }.' });
  }

  await prisma.$transaction(
    order.map((item) =>
      prisma.gallery.update({
        where: { id: Number(item.id) },
        data: { displayOrder: Number(item.displayOrder) },
      })
    )
  );

  res.json({ message: 'Gallery reordered successfully.' });
});

module.exports = {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
};
