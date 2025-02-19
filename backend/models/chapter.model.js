import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true, // Automatically adds createdAt & updatedAt fields
    }

);

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;