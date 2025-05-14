import express from "express";
import {
  handleMultipleUpload,
  handleUpload,
} from "../middlewares/uploadMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Single file upload - authenticated users can upload
router.post(
  "/upload-single",
  authMiddleware,
  handleUpload("image", { folder: "blogs" }),
  (req, res) => {
    res.json({
      success: true,
      files: req.files,
    });
  }
);

// Multiple file upload - admin only
router.post(
  "/upload-multiple",
  authMiddleware,
  authorizeRoles("admin"),
  handleMultipleUpload("files", 5, { folder: "blogs/files" }),
  (req, res) => {
    res.json({
      success: true,
      files: req.files,
    });
  }
);

export default router;
