import mongoose from "mongoose";
import Reminder from "../models/reminder.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { taskId, offset } = req.body; // Offset is the number of minutes before the task's start time

    const userId = req.user.id;

    if (!taskId || offset === undefined) {
      return res
        .status(400)
        .json({ error: "Task ID and offset time are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    // Validate that the offset is a positive number
    if (typeof offset !== "number" || offset <= 0) {
      return res
        .status(400)
        .json({ error: "Offset must be a positive number" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Calculate the notification time: task's start time minus the offset (in minutes)
    const notificationTime = new Date(task.startTime);
    notificationTime.setMinutes(notificationTime.getMinutes() - offset);

    // Create a new reminder with the calculated notification time
    const newReminder = new Reminder({
      taskId,
      userId,
      offset,
      notificationTime: new Date(task.startTime - offset * 60 * 1000), // Convert offset to milliseconds
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
// Get all reminders
export const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.find({ userId }).populate({
      path: "taskId",
      select: "title description startTime", // Populate task with startTime now instead of dueDate
    });
    res.status(200).json(reminders);
  } catch (error) {
    console.log("Error fetching reminders:", error);
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
      console.log("Reminder not found", error);
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
    const { taskId, offset } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid Reminder ID" });
    }

    const existingReminder = await Reminder.findById(reminderId);
    if (!existingReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // Update task if taskId is provided
    if (taskId) {
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: "Invalid Task ID" });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      existingReminder.taskId = taskId;

      // Recalculate notification time if offset is provided
      if (offset !== undefined) {
        const notificationTime = new Date(task.startTime);
        notificationTime.setMinutes(notificationTime.getMinutes() - offset);
        existingReminder.notificationTime = notificationTime;
      }
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
    console.log("Error deleting reminder:", error);
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
