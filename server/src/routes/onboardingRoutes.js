
import express from "express";
import { saveOnboarding } from "../controllers/onboardingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save onboarding details for logged-in user
router.post("/", authMiddleware, saveOnboarding);

export default router;
