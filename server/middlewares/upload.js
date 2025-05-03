const multer = require("multer");
const path = require("path");

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store file temporarily
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter to ensure only CSV files are uploaded
const fileFilter = (req, file, cb) => {
  const allowedMime = ["text/csv", "application/vnd.ms-excel"];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

// Multer configuration without file size limit
const upload = multer({
  storage,      // Using the defined storage configuration
  fileFilter,   // Using the defined file filter
  // Note: No `limits` option here for unlimited file size
});

module.exports = upload;
