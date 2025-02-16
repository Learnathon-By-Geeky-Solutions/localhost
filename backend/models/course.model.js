import mongoose from "mongoose";

/**
 * Schema: Defines a structured format for a MongoDB document.
 * Even though MongoDB is schema-less, enforcing a schema helps maintain consistency.
 * A schema acts like a class definition in Object-Oriented Programming.
 * 
 * Here, the Course schema represents a "Course" document.
 */

const courseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, // References User model
            ref: "User", // Foreign key linking to the User model
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true, // Removes unnecessary spaces
        },
        description: {
            type: String,
            default: "", // Optional field
        }
    },
    {
        timestamps: true, // Automatically adds createdAt & updatedAt fields
    }
);

/**
 * Schema({field_definitions}, {schema_options})
 * - The first object defines the fields (what data is stored).
 * - The second object modifies behavior (e.g., timestamps).
 */

const Course = mongoose.model("Course", courseSchema);
// model(name, schema) - Name should be singular, capitalized.

export default Course;
