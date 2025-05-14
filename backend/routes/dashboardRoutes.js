import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { 
  getDashboardStats, 
  getRecentActivity,
  getPopularBlogs
} from "../controllers/dashboardController.js";

const router = express.Router();

// Apply authentication and admin role middleware to all dashboard routes
router.use(authMiddleware, authorizeRoles("admin"));

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);
router.get("/popular-blogs", getPopularBlogs);

export default router; 