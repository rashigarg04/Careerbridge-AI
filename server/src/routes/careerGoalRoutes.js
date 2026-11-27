
import express from "express";

import {
  createCareerGoal,
  getCareerGoals,
  updateCareerGoal,
  deleteCareerGoal,
} from "../controllers/careerGoalController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All career goal routes require authentication
router.use(authMiddleware);

// Create a career goal
router.post("/", createCareerGoal);

// Get all career goals
router.get("/", getCareerGoals);

// Update a career goal
router.put("/:id", updateCareerGoal);

// Delete a career goal
router.delete("/:id", deleteCareerGoal);

export default router;
