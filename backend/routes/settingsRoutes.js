import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

// Protect all settings routes - admin only
router.use(authMiddleware, authorizeRoles("admin"));

// GET settings
router.get("/", getSettings);

// UPDATE settings
router.put("/", updateSettings);

export default router; 