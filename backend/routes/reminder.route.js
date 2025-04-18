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
import { rateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/create", rateLimiter, protectRoute, createReminder);

router.get("/", rateLimiter, protectRoute, getReminders);

router.get("/:id", rateLimiter, protectRoute, getReminderById);

router.put("/:id", rateLimiter, protectRoute, updateReminder);

router.delete("/:id", rateLimiter, protectRoute, deleteReminder);

router.post("/subscribe", rateLimiter, protectRoute, subscribeUser);

export default router;
