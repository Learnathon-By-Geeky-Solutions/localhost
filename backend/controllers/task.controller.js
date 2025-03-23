import Task from "../models/task.model.js";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";


export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, courseId, chapterId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Verify if courseId exists in the Course collection
    let validCourse = null;
    if (courseId) {
      validCourse = await Course.findById(courseId);
      if (!validCourse) {
        return res.status(400).json({ message: "Invalid courseId. Course not found." });
      }
    }

    // Verify if chapterId exists in the Chapter collection
    let validChapter = null;
    if (chapterId) {
      validChapter = await Chapter.findById(chapterId);
      if (!validChapter) {
        return res.status(400).json({ message: "Invalid chapterId. Chapter not found." });
      }
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      courseId: validCourse ? validCourse._id : null,  
      chapterId: validChapter ? validChapter._id : null,
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
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, courseId, chapterId } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Update the task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    // Handle courseId and chapterId
    if (courseId === null) {
      task.courseId = null; // Set to null if the request explicitly asks for it
    } else if (courseId) {
      task.courseId = new mongoose.Types.ObjectId(courseId); // Ensure it's a valid ObjectId
    }

    if (chapterId === null) {
      task.chapterId = null; // Set to null if the request explicitly asks for it
    } else if (chapterId) {
      task.chapterId = new mongoose.Types.ObjectId(chapterId); // Ensure it's a valid ObjectId
    }

    // Save updated task
    const updatedTask = await task.save();

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task (Protected)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all tasks under a specific course (Protected)
export const getTasksByCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const { courseId } = req.params; // Extract courseId from URL

    const tasks = await Task.find({ user: req.user._id, courseId })
      .populate("courseId", "title") // Fetch course title
      .populate("chapterId", "title") // Fetch chapter title
      .sort({ dueDate: 1 });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all tasks under a specific chapter (Protected)
export const getTasksByChapter = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const { chapterId } = req.params; // Extract chapterId from URL

    const tasks = await Task.find({ user: req.user._id, chapterId })
      .populate("courseId", "title") // Fetch course title
      .populate("chapterId", "title") // Fetch chapter title
      .sort({ dueDate: 1 });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// // Get a specific task by ID (Protected)
// export const getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     // Check if the task belongs to the logged-in user
//     if (task.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }

//     res.json(task);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



