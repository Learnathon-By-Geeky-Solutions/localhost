import express from "express";
import { 
  createTask, 
  getUserTasks, 
  updateTask, 
  deleteTask,
  getTasksByCourse, 
  getTasksByChapter, 
  changeStatus
} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; 
import { rateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Define task routes
router.route("/")
  .post(rateLimiter, protectRoute, createTask)        // Create a Task
  .get(rateLimiter, protectRoute, getUserTasks);      // Get all tasks

// Routes for tasks filtered by course or chapter
router.get("/course/:courseId", rateLimiter, protectRoute, getTasksByCourse);     // Get tasks under a course
router.get("/chapter/:chapterId", rateLimiter, protectRoute, getTasksByChapter);  // Get tasks under a chapter

router.route("/:id")
  // .get(rateLimiter, protectRoute, getTaskById)      // Get a single task by ID (commented out)
  .put(rateLimiter, protectRoute, updateTask)         // Update a task
  .delete(rateLimiter, protectRoute, deleteTask)     // Delete a task
  .patch(rateLimiter, protectRoute, changeStatus);    // change status 
export default router;
