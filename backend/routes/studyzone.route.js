import express from 'express';
import {
  createSession,
  updateSession,
  getTodaySessions,
  getWeeklySessions,
  deleteSession,
} from '../controllers/studyzone.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a new study session
router.post('/sessions', protectRoute, createSession);

// Route to update an existing study session
router.put('/sessions/:id', protectRoute,updateSession);

// Route to get today's study sessions
router.get('/sessions/today',protectRoute, getTodaySessions);

// Route to get study sessions for the past week
router.get('/sessions/week',protectRoute, getWeeklySessions);

// Route to delete a study session
router.delete('/sessions/:id', deleteSession); 

export default router;
