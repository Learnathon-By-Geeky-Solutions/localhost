import mongoose from "mongoose";

// Define the schema for StudyZone
const StudyzoneSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  duration: { type: Number, required: true, min: 1 }, // Ensure duration is a positive number
  timestamp: { type: Date, default: Date.now } // Default to the current time if not provided
});

// Create the model based on the schema
const Studyzone = mongoose.model('Studyzone', StudyzoneSchema);

export default Studyzone;
