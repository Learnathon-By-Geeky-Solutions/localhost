import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/", rateLimiter, protectRoute, createCourse);

router.get("/", rateLimiter, protectRoute, getCourses);

router.get("/:id", rateLimiter, protectRoute, getCourseById);

router.put("/:id", rateLimiter, protectRoute, updateCourse);

router.delete("/:id", rateLimiter, protectRoute, deleteCourse);

export default router;
