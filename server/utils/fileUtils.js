const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

/**
 * Deletes a physical file from the uploads folder given its stored path
 * (e.g. "/uploads/image-123.webp") or a bare filename.
 * Silently ignores missing files.
 */
function deleteUploadedFile(storedPath) {
  if (!storedPath) return;
  const filename = path.basename(storedPath);
  const fullPath = path.join(UPLOADS_DIR, filename);

  // Ensure the resolved path stays within the uploads directory
  if (!fullPath.startsWith(UPLOADS_DIR)) return;

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete file:', fullPath, err.message);
    }
  });
}

module.exports = { deleteUploadedFile, UPLOADS_DIR };
