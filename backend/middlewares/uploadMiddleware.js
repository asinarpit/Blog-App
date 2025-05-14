import multer from "multer";
import cloudinary from "../config/cloudinary.js";
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }

    cb(null, true);
  },
});

const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const handleUpload = (fieldName, options = {}) => {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      try {
        if (!req.file) {
          return next();
        }

        const result = await uploadToCloudinary(req.file.buffer, {
          folder: options.folder || "blogs",
          resource_type: "auto",
          ...options,
        });

        req.file = {
          ...req.file,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
        };

        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "File upload failed",
          error: error.message,
        });
      }
    },
  ];
};

// for multiple files
const handleMultipleUpload = (fieldName, maxCount = 5, options = {}) => {
  return [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return next();
        }

        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, {
            folder: options.folder || "uploads",
            resource_type: "auto",
            ...options,
          })
        );

        const results = await Promise.all(uploadPromises);

        req.files = results.map((result) => ({
          ...result,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
        }));

        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Multiple file upload failed",
          error: error.message,
        });
      }
    },
  ];
};

export { handleMultipleUpload, handleUpload, upload, uploadToCloudinary };
