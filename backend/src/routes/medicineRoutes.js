import express from "express";
import { translateMedicineResult, uploadMedicineImage } from "../controllers/medicineController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleUploadErrors } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", protect, handleUploadErrors, uploadMedicineImage);
router.post("/analyze", protect, handleUploadErrors, uploadMedicineImage);
router.post("/translate", protect, translateMedicineResult);

export default router;
