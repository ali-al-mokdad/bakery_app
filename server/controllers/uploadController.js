const path = require('path');
const { deleteUploadedFile } = require('../utils/fileUtils');

// POST /api/uploads/image (protected) - single image upload
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  res.status(201).json({
    path: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
};

// POST /api/uploads/multiple (protected) - multiple image upload
const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files provided.' });
  }
  const files = req.files.map((f) => ({
    path: `/uploads/${f.filename}`,
    filename: f.filename,
  }));
  res.status(201).json(files);
};

// DELETE /api/uploads/:filename (protected)
const deleteImage = (req, res) => {
  const { filename } = req.params;
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ message: 'Invalid filename.' });
  }
  deleteUploadedFile(filename);
  res.json({ message: 'File deleted successfully.' });
};

module.exports = { uploadImage, uploadMultipleImages, deleteImage };
