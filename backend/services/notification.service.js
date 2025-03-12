import Reminder from "../models/reminder.model.js";
import { sendEmail } from "../services/email.service.js"; // Import the email service
import cron from "node-cron";

// Function to send reminder notifications
const sendReminderNotifications = async () => {
  //this is for debugging
  console.log("Cron job running at:", new Date());
  try {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find reminders due within the next 24 hours and where notification is not sent
    const reminders = await Reminder.find({
      dueDate: { $lte: oneDayLater },
      notificationSent: false,
    });

    for (const reminder of reminders) {
      // Send email using the email service
      await sendEmail(reminder);

      // Mark the notification as sent
      reminder.notificationSent = true;
      await reminder.save();
    }
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
  }
};

// check for notification every 5 minutes
cron.schedule("*/5 * * * *", sendReminderNotifications);

export { sendReminderNotifications };
