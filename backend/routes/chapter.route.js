import express from "express";
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a chapter
router.post("/", protectRoute, createChapter);

// Get all chapters for a course (using '/course/:courseId' to avoid conflict with getChapterById)
// router.get("/course/:courseId", protectRoute, getChapters);

/**
 * @changed_the_path_to_maintain_consistancy
 */
router.post("/", protectRoute, getChapters);

// Get a single chapter by ID
router.get("/:id", protectRoute, getChapterById);

// Update a chapter
router.put("/:id", protectRoute, updateChapter);

// Delete a chapter
router.delete("/:id", protectRoute, deleteChapter);

export default router;
