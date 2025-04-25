import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    notificationTime: {
      type: Date,
      required: true, // Ensure this is set when creating a reminder
    },
    notificationSent: {
      type: Boolean,
      default: false,
    }, // To prevent duplicate notifications
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
