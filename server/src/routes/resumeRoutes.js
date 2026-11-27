
import express from "express";

import {
  uploadResume,
  getResumes,
  deleteResume,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import resumeUpload from "../middleware/resumeUpload.js";

const router = express.Router();

// All resume routes require authentication
router.use(authMiddleware);

// Upload resume
router.post("/upload", resumeUpload.single("resume"), uploadResume);

// Get logged-in user's resumes
router.get("/", getResumes);

// Delete resume
router.delete("/:id", deleteResume);

export default router;
