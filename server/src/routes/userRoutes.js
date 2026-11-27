
import express from "express";

import {
  getCurrentUser,
  updateProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", authMiddleware, getCurrentUser);

// Update logged-in user's profile
router.put("/me", authMiddleware, updateProfile);

export default router;
