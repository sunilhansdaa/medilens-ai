import express from "express";
import {
  createReport,
  deleteReport,
  getReports,
  getReportById
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.delete("/:id", deleteReport);

export default router;
