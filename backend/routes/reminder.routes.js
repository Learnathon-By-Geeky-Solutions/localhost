import express from "express";
import {
  createReminder,
  getReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from "../controllers/reminder.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createReminder);

router.get("/", protectRoute, getReminders);

router.get("/:id", protectRoute, getReminderById);

router.put("/:id", protectRoute, updateReminder);

router.delete("/:id", protectRoute, deleteReminder);

export default router;
