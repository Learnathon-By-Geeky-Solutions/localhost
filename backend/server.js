
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB  from "./config/mongodb.js";

import authRoutes from "./routes/auth.routes.js";


const app = express();
dotenv.config();

const PORT = process.env.PORT;
// const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);



app.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
