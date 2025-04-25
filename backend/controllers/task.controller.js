import Task from "../models/task.model.js";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// --- Helper functions:

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






export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      startTime,
      endTime,
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


export const getUserTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const tasks = await Task.find({ user: req.user._id })
      .populate({ path: "courseId", select: "title" })
      .populate({ path: "chapterId", select: "title" })
      .sort({ startTime: 1 });

    return res.status(200).json(tasks );
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateTask = async (req, res) => {
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

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: "endTime must be after startTime." });
    }

    // Update basic fields (if provided)
    Object.assign(task, {
      title: title ?? task.title,
      description: description ?? task.description,
      startTime: startTime ?? task.startTime,
      endTime: endTime ?? task.endTime,
      priority: priority ?? task.priority,
      status: status ?? task.status,
    });

    // Update courseId (can be set to null or a valid ID)
    if (courseId === null) {
      task.courseId = null;
    } else if (courseId) {
      const course = await validateCourse(courseId);
      if (course instanceof Error) {
        return res.status(400).json({ message: course.message });
      }
      task.courseId = course._id;
    }

    // Update chapterId (can be set to null or a valid ID)
    if (chapterId === null) {
      task.chapterId = null;
    } else if (chapterId) {
      const chapter = await validateChapter(chapterId);
      if (chapter instanceof Error) {
        return res.status(400).json({ message: chapter.message });
      }
      task.chapterId = chapter._id;
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
