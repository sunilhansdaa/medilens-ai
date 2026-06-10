const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.resolve(__dirname, '../../uploads');
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(extension, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    cb(null, `${safeName}-${Date.now()}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only JPG, JPEG, and PNG image files are allowed'));
};

const uploadMedicineImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
}).single('image');

const handleUploadErrors = (req, res, next) => {
  uploadMedicineImage(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'Image size must be 10MB or less'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  });
};

module.exports = { handleUploadErrors };