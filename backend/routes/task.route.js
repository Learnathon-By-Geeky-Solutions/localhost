import express from "express";
import { 
  createTask, 
  getUserTasks, 
  // getTaskById, 
  updateTask, 
  deleteTask ,
  getTasksByCourse, 
  getTasksByChapter 

} from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Define task routes
router.route("/")
  .post(protectRoute, createTask)   // Create a Task
  .get(protectRoute, getUserTasks );     // Get all tasks

  
// Routes for tasks filtered by course or chapter
router.get("/course/:courseId", protectRoute, getTasksByCourse);   // Get tasks under a course
router.get("/chapter/:chapterId", protectRoute, getTasksByChapter); // Get tasks under a chapter


router.route("/:id")
  // .get(protectRoute, getTaskById)   // Get a single task by ID
  .put(protectRoute, updateTask)    // Update a task
  .delete(protectRoute, deleteTask); // Delete a task

export default router;
