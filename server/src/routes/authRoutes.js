
import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Signup API
router.post("/signup", signup);

// Login API
router.post("/login", login);

// Forgot Password API
router.post("/forgot-password", forgotPassword);

// Reset Password API
router.post("/reset-password/:token", resetPassword);

export default router;
