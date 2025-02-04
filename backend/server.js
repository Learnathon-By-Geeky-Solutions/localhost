
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB  from "./config/mongodb.js";

import authRoutes from "./routes/auth.routes.js";


const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.BASE_URL}:${process.env.CLIENT_PORT}`,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);



const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`server is running on ${process.env.BASE_URL}:${port}`);
  connectDB();
});
