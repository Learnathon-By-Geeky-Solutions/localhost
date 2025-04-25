import express from "express";
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Create a chapter
router.post("/", rateLimiter, protectRoute, createChapter);

// Get all chapters for a course
router.get("/all/:courseId", rateLimiter, protectRoute, getChapters);

// Get a single chapter by ID
router.get("/:id", rateLimiter, protectRoute, getChapterById);

// Update a chapter
router.put("/:id", rateLimiter, protectRoute, updateChapter);

// Delete a chapter
router.delete("/:id", rateLimiter, protectRoute, deleteChapter);

export default router;
