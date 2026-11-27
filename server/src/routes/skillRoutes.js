
import express from "express";

import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All skill routes require authentication
router.use(authMiddleware);

// Create a skill
router.post("/", createSkill);

// Get all skills
router.get("/", getSkills);

// Update a skill
router.put("/:id", updateSkill);

// Delete a skill
router.delete("/:id", deleteSkill);

export default router;
