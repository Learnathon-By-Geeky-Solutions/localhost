import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    }, // Now taskId is mandatory and taskTitle, description are removed
    dueDate: {
      type: Date,
      required: true,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    }, // To prevent duplicate notifications
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;














// import mongoose from "mongoose";

// const reminderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     taskTitle: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//     },
//     dueDate: {
//       type: Date,
//       required: true,
//     },
//     notificationSent: {
//       type: Boolean,
//       default: false,
//     }, //to not send duplicate notification
//     taskId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Task",
//       default: null,
//     }, // Optional
//   },
//   {
//     timestamps: true,
//   }
// );

// const Reminder = mongoose.model("Reminder", reminderSchema);
// export default Reminder;
