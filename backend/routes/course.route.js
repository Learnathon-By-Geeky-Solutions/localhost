import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createCourse);

router.get("/", protectRoute, getCourses);

router.get("/:id", protectRoute, getCourseById);

router.put("/:id", protectRoute, updateCourse);

router.delete("/:id", protectRoute, deleteCourse);

export default router;
