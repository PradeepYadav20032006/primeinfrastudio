const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/;

const fileFilter = (req, file, cb) => {
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
  if (extValid && mimeValid) return cb(null, true);
  cb(new Error('Only images (jpg, jpeg, png, webp, gif) and PDF files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_UPLOAD_MB, 10) || 5) * 1024 * 1024 },
});

module.exports = upload;
