import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Attendance from '../models/Attendance.js';
import CGPA from '../models/CGPA.js';
import Academic from '../models/Academic.js';
import Notification from '../models/Notification.js';
import Financial from '../models/Financial.js';
import Contact from '../models/Contact.js';
import Student from '../models/Student.js'; // Just in case if we want to return full student info too

const router = express.Router();

// Apply middleware to all routes in this file
router.use(authMiddleware);

// Get complete dashboard data for the logged-in student
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.user.id; // From auth token

    // Run queries in parallel for efficiency
    const [
      student,
      attendance,
      cgpa,
      academic,
      notifications,
      financial,
      rawContacts
    ] = await Promise.all([
      Student.findOne({ id: studentId }).lean(),
      Attendance.findOne({ studentId }).lean(),
      CGPA.findOne({ studentId }).lean(),
      Academic.findOne({ studentId }).lean(),
      Notification.findOne({ studentId }).lean(),
      Financial.findOne({ studentId }).lean(),
      Contact.find().lean()
    ]);

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Process contacts to match frontend structure 
    const contacts = {
      counsellors: rawContacts.filter(c => c.type === 'counsellor'),
      faculty: rawContacts.filter(c => c.type === 'faculty'),
      administration: rawContacts.filter(c => c.type === 'administration')
    };

    res.json({
      student,
      attendance,
      cgpa,
      academic,
      notifications,
      financial,
      contacts
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching data.' });
  }
});

export default router;
