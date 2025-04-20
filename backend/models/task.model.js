import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'In Progress'],
      default: 'Pending'
    },
    startTime: {
      type: Date,
      required: false
    },
    endTime: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          // Only validate if both startTime and endTime are provided
          return !this.startTime || !value || value > this.startTime;
        },
        message: 'End time must be after start time'
      }
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
