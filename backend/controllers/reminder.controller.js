import mongoose from "mongoose";
import Reminder from "../models/reminder.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { taskId } = req.body;
    const userId = req.user.id;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const newReminder = new Reminder({
      taskId,
      dueDate: task.dueDate,
      userId,
    });

    await newReminder.save();

    res.status(201).json({
      success: true,
      message: "Reminder created successfully",
      reminder: newReminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all reminders
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.find({ userId }).populate({
      path: "taskId",
      select: "title description dueDate",
    });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific reminder by ID
export const getReminderById = async (req, res) => {
  try {
    const reminderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid Reminder ID" });
    }

    const reminder = await Reminder.findById(reminderId);
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const { taskId, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid Reminder ID" });
    }

    const existingReminder = await Reminder.findById(reminderId);
    if (!existingReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    if (taskId) {
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: "Invalid Task ID" });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      existingReminder.taskId = taskId;
    }

    if (dueDate) {
      existingReminder.dueDate = dueDate;
    }

    await existingReminder.save();

    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      reminder: existingReminder,
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid Reminder ID" });
    }

    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);
    if (!deletedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Subscribe user to push notifications
export const subscribeUser = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({ message: "Subscription saved successfully" });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
