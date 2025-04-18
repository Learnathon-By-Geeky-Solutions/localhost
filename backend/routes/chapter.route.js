import express from "express";
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Configure rate limiter: maximum of 100 requests per 15 minutes
const getChaptersLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Create a chapter
router.post("/", protectRoute, createChapter);

// Get all chapters for a course (using '/course/:courseId' to avoid conflict with getChapterById)
// router.get("/course/:courseId", protectRoute, getChapters);

/**
 * @changed_the_path_to_maintain_consistancy
 */
router.get("/all/:courseId", protectRoute, getChaptersLimiter, getChapters);

// Get a single chapter by ID
router.get("/:id", protectRoute, getChapterById);

// Update a chapter
router.put("/:id", protectRoute, updateChapter);

// Delete a chapter
router.delete("/:id", protectRoute, deleteChapter);

export default router;
