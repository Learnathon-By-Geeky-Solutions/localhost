import Reminder from "../models/reminder.model.js";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

// // Create a new reminder
// export const createReminder = async (req, res) => {
//   try {
//     const { taskTitle, description, dueDate } = req.body;
//     const userId = req.user.id;

//     if (!taskTitle || !dueDate) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Fetch user email
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Create new reminder
//     const newReminder = new Reminder({
//       taskTitle,
//       description,
//       dueDate,
//       userId,
//     });

//     await newReminder.save();

//     res.status(201).json({
//       success: true,
//       message: "Reminder created successfully",
//       reminder: newReminder,
//     });
//   } catch (error) {
//     console.error("Error creating reminder:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { taskId, dueDate } = req.body;
    const userId = req.user.id;

    if (!taskId || !dueDate) {
      return res.status(400).json({ error: "Task ID and due date are required" });
    }

    // Check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Create new reminder
    const newReminder = new Reminder({
      taskId,
      dueDate,
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

// // Update a reminder
// export const updateReminder = async (req, res) => {
//   try {
//     const updatedReminder = await Reminder.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedReminder) {
//       return res.status(404).json({ error: "Reminder not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Reminder updated successfully",
//       updatedReminder,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };


// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const { taskId, dueDate } = req.body;

    // Validate if the reminder exists
    const existingReminder = await Reminder.findById(req.params.id);
    if (!existingReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // If taskId is provided, check if the task exists
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
    }

    // Update the reminder
    existingReminder.taskId = taskId || existingReminder.taskId;
    existingReminder.dueDate = dueDate || existingReminder.dueDate;

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

// Subscribe user to push notifications
export const subscribeUser = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated user

    // Find the user and save the subscription
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
