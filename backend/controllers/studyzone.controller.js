import mongoose from 'mongoose';
import StudySession from '../models/studyzone.model.js';

export const createSession = async (req, res) => {
  try {
    const { courseId, duration, date } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Use the provided date or default to today
    const sessionDate = date ? new Date(date) : new Date();
    sessionDate.setHours(0, 0, 0, 0); // Normalize time

    const session = new StudySession({ courseId, duration, timestamp: sessionDate });
    await session.save();
    
    res.json({ message: 'Session saved!', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const sessionDate = date ? new Date(date) : undefined;
    if (sessionDate) sessionDate.setHours(0, 0, 0, 0); // Normalize time to midnight

    // Only update the duration and timestamp
    const session = await StudySession.findByIdAndUpdate(
      id,
      { 
        duration, 
        ...(sessionDate && { timestamp: sessionDate }) 
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session updated!', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getTodaySessions = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({ timestamp: { $gte: start } }).populate('courseId');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getWeeklySessions = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({ timestamp: { $gte: start } }).populate('courseId');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    const session = await StudySession.findByIdAndDelete(id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted!', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};