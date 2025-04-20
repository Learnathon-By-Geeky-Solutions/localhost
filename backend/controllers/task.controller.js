import Task from "../models/task.model.js";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      priority,
      status,
      courseId,
      chapterId,
    } = req.body;

    // Check authentication
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Validate time logic
    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "endTime must be after startTime." });
    }

    // Validate optional relations
    const course = await validateCourse(courseId);
    if (course instanceof Error) {
      return res.status(400).json({ message: course.message });
    }

    const chapter = await validateChapter(chapterId);
    if (chapter instanceof Error) {
      return res.status(400).json({ message: chapter.message });
    }

    // Create task
    const newTask = new Task({
      title,
      description,
      startTime,
      endTime,
      priority,
      status,
      courseId: course?._id || null,
      chapterId: chapter?._id || null,
      user: req.user._id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Helper functions below for createTask:

const validateCourse = async (courseId) => {
  if (!courseId) return null;
  if (!isValidObjectId(courseId)) return new Error("Invalid courseId format.");

  const course = await Course.findById(courseId);
  if (!course) return new Error("Invalid courseId. Course not found.");

  return course;
};

const validateChapter = async (chapterId) => {
  if (!chapterId) return null;
  if (!isValidObjectId(chapterId)) return new Error("Invalid chapterId format.");

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return new Error("Invalid chapterId. Chapter not found.");

  return chapter;
};


//////////////////////////////////////////////////////////////////////


export const getUserTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const tasks = await Task.find({ user: req.user._id })
      .populate({ path: "courseId", select: "title" })
      .populate({ path: "chapterId", select: "title" })
      .sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, startTime, endTime, priority, status, courseId, chapterId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "endTime must be after startTime." });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.startTime = startTime ?? task.startTime;
    task.endTime = endTime ?? task.endTime;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;

    // Validate and update courseId
    if (courseId === null) {
      task.courseId = null;
    } else if (courseId) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ message: "Invalid courseId format." });
      }
      const validCourse = await Course.findById(courseId);
      if (!validCourse) {
        return res.status(400).json({ message: "Invalid courseId. Course not found." });
      }
      task.courseId = validCourse._id;
    }

    // Validate and update chapterId
    if (chapterId === null) {
      task.chapterId = null;
    } else if (chapterId) {
      if (!isValidObjectId(chapterId)) {
        return res.status(400).json({ message: "Invalid chapterId format." });
      }
      const validChapter = await Chapter.findById(chapterId);
      if (!validChapter) {
        return res.status(400).json({ message: "Invalid chapterId. Chapter not found." });
      }
      task.chapterId = validChapter._id;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksByCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ message: "Invalid courseId format." });
    }

    const tasks = await Task.find({ user: req.user._id, courseId })
      .populate("courseId", "title")
      .populate("chapterId", "title")
      .sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksByChapter = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const { chapterId } = req.params;

    if (!isValidObjectId(chapterId)) {
      return res.status(400).json({ message: "Invalid chapterId format." });
    }

    const tasks = await Task.find({ user: req.user._id, chapterId })
      .populate("courseId", "title")
      .populate("chapterId", "title")
      .sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
