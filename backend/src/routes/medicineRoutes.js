const express = require('express');
const { translateMedicineResult, uploadMedicineImage } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');
const { handleUploadErrors } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', protect, handleUploadErrors, uploadMedicineImage);
router.post('/analyze', protect, handleUploadErrors, uploadMedicineImage);
router.post('/translate', protect, translateMedicineResult);

module.exports = router;