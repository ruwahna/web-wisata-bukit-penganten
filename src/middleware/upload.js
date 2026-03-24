const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'assets', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Hanya file gambar yang diizinkan.'));
      return;
    }
    cb(null, true);
  },
});

/**
 * Map file upload ke path relatif yang bisa diakses dari browser.
 */
const mapUploadPath = (file) => {
  if (!file) return '';
  return `assets/uploads/${file.filename}`;
};

module.exports = { upload, mapUploadPath, uploadDir };
