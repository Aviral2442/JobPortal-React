const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createJob,
  createJobDraft, // optional if used elsewhere
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  saveJobSection,
  uploadJobFiles,
  deleteJobArrayItem,
} = require("../controllers/jobController");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/jobs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// GET all jobs
router.get("/", getJobs);

// GET by id
router.get("/:id", getJobById);

// Create job (multipart)
router.post(
  "/",
  upload.fields([
    { name: "files", maxCount: 12 },
    { name: "logo", maxCount: 1 },
  ]),
  createJob
);

// Update entire job
router.put(
  "/:id",
  upload.fields([
    { name: "files", maxCount: 12 },
    { name: "logo", maxCount: 1 },
  ]),
  updateJob
);

// Delete job
router.delete("/:id", deleteJob);

// Section-wise save
router.post("/save-section", saveJobSection);

// Upload files separately
router.post("/files", upload.array("files", 12), uploadJobFiles);

// Delete array item by index
router.delete("/:id/section/:section/:index", deleteJobArrayItem);

module.exports = router;
