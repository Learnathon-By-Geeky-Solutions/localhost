import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 1000, 
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});