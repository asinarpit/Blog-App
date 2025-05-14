import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  createUser
} from "../controllers/userController.js";

const router = express.Router();

// These routes should be defined in userController.js
// Import them once implemented
// import { 
//   getAllUsers, 
//   getUserById, 
//   updateUserRole, 
//   deleteUser 
// } from "../controllers/userController.js";

// All user management routes require admin privileges
router.use(authMiddleware, authorizeRoles("admin"));

// GET all users
router.get("/", getAllUsers);

// GET user by ID
router.get("/:id", getUserById);

// CREATE new user
router.post("/", createUser);

// UPDATE user role
router.patch("/:id/role", updateUserRole);

// DELETE user
router.delete("/:id", deleteUser);

export default router; 