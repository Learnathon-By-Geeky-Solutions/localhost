import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Organization email
    pass: process.env.EMAIL_PASS, // App password (not the real email password)
  },
});

export const sendEmail = async (reminder) => {
  try {
    // Fetch the user’s email
    const user = await User.findById(reminder.userId);
    if (!user) {
      console.error("User not found for reminder:", reminder._id);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Task Reminder",
      text: `Don't forget to complete: ${reminder.taskTitle} before ${reminder.dueDate}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
