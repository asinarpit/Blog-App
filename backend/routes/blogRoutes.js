import express from "express";
import {
  addComment,
  addReply,
  createBlog,
  deleteBlog,
  deleteComment,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  toggleCommentLike,
  toggleLike,
  updateBlog,
} from "../controllers/blogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { handleUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);

// Admin routes - must be defined before /:slug routes to avoid conflicts
router.get("/admin", authMiddleware, authorizeRoles("admin"), getBlogs);
router.patch("/:id/status", authMiddleware, authorizeRoles("admin"), updateBlog);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteBlog);
router.delete("/comments/:commentId", authMiddleware, authorizeRoles("admin"), deleteComment);

// Routes with parameters
router.get("/:slug", getBlogBySlug);
router.get("/:id", getBlogById);

// Other authenticated routes
router.post(
  "/",
  authMiddleware,
  handleUpload("image", { folder: "blogs" }),
  createBlog
);
router.put("/:id", authMiddleware, updateBlog);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comments", authMiddleware, addComment);
router.post(
  "/:blogId/comments/:commentId/like",
  authMiddleware,
  toggleCommentLike
);
router.post("/:blogId/comments/:commentId/replies", authMiddleware, addReply);

export default router;
