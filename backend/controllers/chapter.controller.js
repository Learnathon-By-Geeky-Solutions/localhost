import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";

//Create a new chapter
export const createChapter = async (req, res) => {
    try {
        const { courseId, title, content } = req.body;

        // Validate course existence
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newChapter = new Chapter({ courseId, title, content });
        await newChapter.save();

        res.status(201).json(newChapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Get all chapters for a course
export const getChapters = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch chapters by courseId
        const chapters = await Chapter.find({ courseId });
        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


//Get single chapter by ID
export const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findById(id);

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Update a chapter
export const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedChapter = await Chapter.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(updatedChapter);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

//Delete a chapter
export const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChapter = await Chapter.findByIdAndDelete(id);

        if (!deletedChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};