import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Task from "../models/task.model.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (reminder) => {
  try {
    // Fetch the task details
    const task = await Task.findById(reminder.taskId).populate("user");
    if (!task) {
      console.error("Task not found for reminder:", reminder.taskId);
      return;
    }

    // Get the user email from the task
    const userEmail = task.user?.email;
    if (!userEmail) {
      console.error("User not found for task:", task._id);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Task Reminder",
      text: `Don't forget to complete: ${task.title} before ${task.dueDate}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error in sendEmail function:", error);
  }
};
