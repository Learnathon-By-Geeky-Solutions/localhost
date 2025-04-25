import express from "express";
import {
  login,
  logout,
  signup,
  getAuthUser,
  sendResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);
router.post("/logout", rateLimiter, logout);
router.get("/me", rateLimiter, protectRoute, getAuthUser);
router.post("/send-reset-otp", rateLimiter, sendResetOtp);
router.post("/reset-password", rateLimiter, resetPassword);

export default router;
