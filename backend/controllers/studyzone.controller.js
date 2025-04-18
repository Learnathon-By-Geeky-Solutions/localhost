import mongoose from 'mongoose';
import StudySession from '../models/studyzone.model.js';

// Validate duration (must be a positive number)
const isValidDuration = (duration) => typeof duration === 'number' && duration >= 0;

// Validate and normalize date
const parseAndNormalizeDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export const createSession = async (req, res) => {
  try {
    const { courseId, duration, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    if (!isValidDuration(duration)) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    const sessionDate = date ? parseAndNormalizeDate(date) : new Date();
    if (!sessionDate) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    sessionDate.setHours(0, 0, 0, 0); // Normalize

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

    if (!isValidDuration(duration)) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    let updateObj = { duration };

    if (date) {
      const sessionDate = parseAndNormalizeDate(date);
      if (!sessionDate) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateObj.timestamp = sessionDate;
    }

    const session = await StudySession.findByIdAndUpdate(id, updateObj, { new: true });

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
