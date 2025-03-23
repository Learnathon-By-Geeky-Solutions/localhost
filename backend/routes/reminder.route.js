import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  subscribeUser,
} from "../controllers/reminder.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createReminder);

router.get("/", protectRoute, getReminders);

router.get("/:id", protectRoute, getReminderById);

router.put("/:id", protectRoute, updateReminder);

router.delete("/:id", protectRoute, deleteReminder);

/* 
this route is needed because: 
The frontend requests permission from the user to send push notifications. If the user grants permission, the browser generates a PushSubscription object. The frontend sends this object to the backend via a POST request to /api/reminders/subscribe.

The backend receives the PushSubscription object and the userId (from the authenticated user).
It saves the subscription data to the User collection in the database.
*/
router.post("/subscribe", protectRoute, subscribeUser);

export default router;
