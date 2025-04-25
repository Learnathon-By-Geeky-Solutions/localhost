import express from 'express';
import {
  createSession,
  updateSession,
  getTodaySessions,
  getWeeklySessions,
  deleteSession,
} from '../controllers/studyzone.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Route to create a new study session
router.post('/sessions', rateLimiter, protectRoute, createSession);

// Route to update an existing study session
router.put('/sessions/:id', rateLimiter, protectRoute, updateSession);

// Route to get today's study sessions
router.get('/sessions/today', rateLimiter, protectRoute, getTodaySessions);

// Route to get study sessions for the past week
router.get('/sessions/week', rateLimiter, protectRoute, getWeeklySessions);

// Route to delete a study session
router.delete('/sessions/:id', rateLimiter, protectRoute, deleteSession);

export default router;
