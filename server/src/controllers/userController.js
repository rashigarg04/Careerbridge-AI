
import User from "../models/User.js";

// Get logged-in user's profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        fullName: user.fullName,
        education: user.education,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Get User Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user profile",
    });
  }
};

// Update logged-in user's profile
export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      education,
      graduationYear,
      targetRole,
      experienceLevel,
      skills,
    } = req.body;

    // Find logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate graduation year if provided
    if (graduationYear !== undefined && graduationYear !== null) {
      const year = Number(graduationYear);

      if (!Number.isInteger(year) || year < 2000 || year > 2040) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid graduation year",
        });
      }

      user.graduationYear = year;
    }

    // Update only permitted profile fields
    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }

    if (education !== undefined) {
      user.education = education;
    }

    if (targetRole !== undefined) {
      user.targetRole = targetRole.trim();
    }

    if (experienceLevel !== undefined) {
      user.experienceLevel = experienceLevel;
    }

    if (skills !== undefined) {
      user.skills = skills.trim();
    }

    // Validate and save changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        fullName: user.fullName,
        education: user.education,
        graduationYear: user.graduationYear,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};
