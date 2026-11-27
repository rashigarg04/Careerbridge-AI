
import User from "../models/User.js";

export const saveOnboarding = async (req, res) => {
  try {
    const {
      fullName,
      education,
      graduationYear,
      targetRole,
      experienceLevel,
      skills,
    } = req.body;

    // Validate required fields
    if (
      !fullName?.trim() ||
      !education ||
      !graduationYear ||
      !targetRole?.trim() ||
      !experienceLevel ||
      !skills?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all onboarding fields",
      });
    }

    const year = Number(graduationYear);

    if (!Number.isInteger(year) || year < 2000 || year > 2040) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid graduation year",
      });
    }

    // Update logged-in user's profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName: fullName.trim(),
        education,
        graduationYear: year,
        targetRole: targetRole.trim(),
        experienceLevel,
        skills: skills.trim(),
        onboardingCompleted: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        education: updatedUser.education,
        graduationYear: updatedUser.graduationYear,
        targetRole: updatedUser.targetRole,
        experienceLevel: updatedUser.experienceLevel,
        skills: updatedUser.skills,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });

  } catch (error) {
    console.error("Onboarding Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save onboarding details",
    });
  }
};
