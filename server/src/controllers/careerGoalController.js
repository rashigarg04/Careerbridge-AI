
import CareerGoal from "../models/CareerGoal.js";

// Create a new career goal
export const createCareerGoal = async (req, res) => {
  try {
    const { title, description, targetRole, targetDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Goal title is required",
      });
    }

    const goal = await CareerGoal.create({
      user: req.user._id,
      title: title.trim(),
      description,
      targetRole,
      targetDate: targetDate || null,
    });

    res.status(201).json({
      success: true,
      message: "Career goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all career goals of logged-in user
export const getCareerGoals = async (req, res) => {
  try {
    const goals = await CareerGoal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a career goal
export const updateCareerGoal = async (req, res) => {
  try {
    const { title, description, targetRole, targetDate, status, progress } =
      req.body;

    const goal = await CareerGoal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Career goal not found",
      });
    }

    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetRole !== undefined) goal.targetRole = targetRole;
    if (targetDate !== undefined) goal.targetDate = targetDate || null;
    if (status !== undefined) goal.status = status;
    if (progress !== undefined) goal.progress = progress;

    await goal.save();

    res.status(200).json({
      success: true,
      message: "Career goal updated successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a career goal
export const deleteCareerGoal = async (req, res) => {
  try {
    const goal = await CareerGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Career goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Career goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
