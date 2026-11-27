
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Technical",
        "Soft Skill",
        "Tools",
        "Other",
      ],
      default: "Technical",
    },

    proficiency: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
