import express from "express";
import { getProfile, login, register, updateSettings } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/settings", protect, updateSettings);

export default router;
