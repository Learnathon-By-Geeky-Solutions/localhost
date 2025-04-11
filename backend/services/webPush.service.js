import webPush from "web-push";
import dotenv from "dotenv";

dotenv.config();

// CMD prompt to generate vapid keys -> npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
  "mailto:officialstudify@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const sendReminderWebPush = async (user, reminder) => {
  if (!user || !user.subscription) {
    console.error("No valid subscription found for user:", user?._id);
    return;
  }

  const payload = JSON.stringify({
    title: "Task Reminder",
    body: `Don't forget to complete: ${reminder.taskTitle} before ${reminder.dueDate}`,
  });

  try {
    await webPush.sendNotification(user.subscription, payload);
    console.log(`Web push notification sent to user ${user._id}`);
  } catch (error) {
    console.error("Error sending web push notification:", error);
  }
};
