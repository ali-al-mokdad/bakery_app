const multer = require('multer');

// 404 handler for unmatched routes
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// Central error handler - never leaks stack traces to the client
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found.' });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message =
    statusCode === 500 ? 'Something went wrong on our end. Please try again later.' : err.message;

  res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
