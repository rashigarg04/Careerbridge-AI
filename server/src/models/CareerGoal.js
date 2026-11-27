
import mongoose from "mongoose";

const careerGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    targetRole: {
      type: String,
      trim: true,
      default: "",
    },

    targetDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CareerGoal = mongoose.model("CareerGoal", careerGoalSchema);

export default CareerGoal;
