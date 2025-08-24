import multer from "multer";
import path from "path";
import fs from "fs";

export const multer4files = (subfolder = "") => {
  const uploadDir = path.join("uploads", subfolder);

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueName + ext);
    },
  });

  // File type filter (allow docs, pdfs, zips, images, etc.)
  function fileFilter(req, file, cb) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/zip",
      "application/x-rar-compressed",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  }

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20 MB max
    },
  });
};
