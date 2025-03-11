import Course from "../models/course.model.js";

// Create a new course
export const createCourse = async (req, res) => {
    const { title, description } = req.body;

    try {
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newCourse = new Course({
            userId: req.user._id,  // Assuming the user is authenticated (middleware used)
            title,
            description,
        });

        // Save the new course to the database
        const savedCourse = await newCourse.save();

        res.status(201).json(savedCourse);
    } catch (error) {
        console.log("Error in create course controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all courses for a specific user
export const getCourses = async (req, res) => {
    try {
        // Find all courses that belong to the logged-in user
        const courses = await Course.find({ userId: req.user._id });

        if (!courses) {
            return res.status(404).json({ message: "No courses found" });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.log("Error in get courses controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a course by ID
export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find a course by ID
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is authorized to view the course
        if (course.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to access this course" });
        }

        res.status(200).json(course);
    } catch (error) {
        console.log("Error in get course by ID controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        // Find the course to update
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is authorized to update this course
        if (course.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this course" });
        }

        // Update the course fields
        course.title = title || course.title;
        course.description = description || course.description;

        // Save the updated course
        const updatedCourse = await course.save();

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.log("Error in update course controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the course to delete
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if the user is authorized to delete this course
        if (course.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this course" });
        }

        // Delete the course
        await Course.findByIdAndDelete(id);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.log("Error in delete course controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
