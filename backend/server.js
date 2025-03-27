import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/mongodb.js";

import authRoutes from "./routes/auth.route.js";
import courseRoutes from "./routes/course.route.js";
import chapterRoutes from "./routes/chapter.route.js";
import taskRoutes from "./routes/task.route.js";
import reminderRoutes from "./routes/reminder.route.js";
import studyzoneRoutes from "./routes/studyzone.route.js"

import "./services/notification.service.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500", // to allow requests from the dummy-frontend
    credentials: true,
  })
);

/*
app.use(
  cors({
    origin: `${process.env.BASE_URL}:${process.env.CLIENT_PORT}`,
    credentials: true,
  })
);
*/

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/studyzone", studyzoneRoutes);


const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`server is running on ${process.env.BASE_URL}:${port}`);
  connectDB();
});
