import Reminder from "../models/reminder.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "./email.service.js";
import { sendReminderWebPush } from "./webPush.service.js";
import cron from "node-cron";

const sendReminderNotifications = async () => {
  console.log("Cron job running at:", new Date());

  try {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const reminders = await Reminder.find({
      dueDate: { $lte: oneDayLater },
      notificationSent: false,
    });

    for (const reminder of reminders) {
      const user = await User.findById(reminder.userId);

      if (user) {
        await sendEmail(reminder); // Send email reminder
        await sendReminderWebPush(user, reminder); // Send web push if subscription exists
      }

      // Mark the notification as sent
      reminder.notificationSent = true;
      await reminder.save();
    }
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
  }
};

// Check for reminders every 5 minute
cron.schedule("*/5 * * * *", sendReminderNotifications);

export { sendReminderNotifications };
