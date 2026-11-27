import dns from "node:dns";
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import careerGoalRoutes from "./routes/careerGoalRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
// Fix MongoDB DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/career-goals", careerGoalRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/resumes", resumeRoutes);
// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "CareerBridge API is running",
  });
});

// Start Server after Database Connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`CareerBridge server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start CareerBridge:", error.message);
    process.exit(1);
  }
};

// Initialize Application
startServer();
