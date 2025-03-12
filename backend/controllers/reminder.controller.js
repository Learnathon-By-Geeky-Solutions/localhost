import Reminder from "../models/reminder.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../services/email.service.js";

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { taskTitle, description, dueDate } = req.body;
    const userId = req.user.id;

    if (!taskTitle || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Fetch user email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create new reminder
    const newReminder = new Reminder({
      taskTitle,
      description,
      dueDate,
      userId,
    });

    await newReminder.save();

    res.status(201).json({
      success: true,
      message: "Reminder created & email sent successfully",
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
    const reminders = await Reminder.find({ userId }); // Fetch only reminders for the logged-in user
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific reminder by ID
export const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
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
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.status(200).json({
      success: true,
      message: "Reminder updated successfully",
      updatedReminder,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
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
