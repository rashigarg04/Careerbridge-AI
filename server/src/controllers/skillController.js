
import Skill from "../models/Skill.js";

// Create a new skill
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const skill = await Skill.create({
      user: req.user._id,
      name: name.trim(),
      category,
      proficiency,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all skills of logged-in user
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an existing skill
export const updateSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;

    const skill = await Skill.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Skill name cannot be empty",
        });
      }

      skill.name = name.trim();
    }

    if (category !== undefined) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = proficiency;

    await skill.save();

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an existing skill
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
