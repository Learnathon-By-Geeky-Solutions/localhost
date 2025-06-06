import mongoose from "mongoose";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new chapter
export const createChapter = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newChapter = new Chapter({ courseId, title, content });
        await newChapter.save();

        res.status(201).json(newChapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all chapters for a course
export const getChapters = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const chapters = await Chapter.find({ courseId });
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single chapter by ID
export const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid chapter ID" });
        }

        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a chapter safely
export const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid chapter ID" });
        }

        const { title, content } = req.body; // extract fields to avoid blindly passing req.body
        
        // Validate and sanitize input
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Invalid title" });
        }
        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({ message: "Invalid content" });
        }
        
        const sanitizedTitle = title.trim();
        const sanitizedContent = content.trim();
        
        const updatedChapter = await Chapter.findByIdAndUpdate(
            id,
            { title: sanitizedTitle, content: sanitizedContent },
            { new: true, runValidators: true }
        );

        if (!updatedChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(updatedChapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a chapter
export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid chapter ID" });
        }

        const deletedChapter = await Chapter.findByIdAndDelete(id);
        if (!deletedChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
