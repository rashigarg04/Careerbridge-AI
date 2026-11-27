
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic account details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    // Onboarding details
    fullName: {
      type: String,
      trim: true,
      default: "",
    },

    education: {
      type: String,
      enum: [
        "",
        "Diploma",
        "Undergraduate",
        "Postgraduate",
        "Graduate",
        "Other",
      ],
      default: "",
    },

    graduationYear: {
      type: Number,
      min: 2000,
      max: 2040,
      default: null,
    },

    targetRole: {
      type: String,
      trim: true,
      default: "",
    },

    experienceLevel: {
      type: String,
      enum: ["", "Beginner", "Intermediate", "Experienced"],
      default: "",
    },

    skills: {
      type: String,
      trim: true,
      default: "",
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    // Password reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
