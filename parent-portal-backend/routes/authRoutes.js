import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Student from '../models/Student.js';

const router = express.Router();

let transporter;

// Step 1: Login (verify regNumber and generate dynamic OTP)
router.post('/login', async (req, res) => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  try {
    const { regNumber, parentEmail } = req.body;

    if (!regNumber || !parentEmail) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const student = await Student.findOne({
      regNumber: regNumber.toUpperCase(),
      parentEmail
    });

    if (!student) {
      return res.status(401).json({ message: 'Invalid Registration Number or Email' });
    }

    // Generate dynamic 6-digit OTP
    const dynamicOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save new OTP to database
    student.otp = dynamicOtp;
    await student.save();

    // Log to terminal for debugging
    console.log(`\n\n=========================================`);
    console.log(`📩 LOGGING OTP TO CONSOLE FOR DEBUGGING`);
    console.log(`🔑 YOUR PARENT PORTAL OTP IS: ${dynamicOtp}`);
    console.log(`=========================================\n\n`);

    if (student.parentEmail) {
      try {
        await transporter.sendMail({
          from: `"Parent Portal" <${process.env.EMAIL_USER}>`,
          to: student.parentEmail,
          subject: "Your OTP for Parent Portal Login",
          text: `Dear Parent,\n\nYour OTP for the Parent Portal login is: ${dynamicOtp}.\n\nDo not share this OTP with anyone.\n\nRegards,\nCollege Administration`
        });
        console.log(`📩 OTP EMAILED TO: ${student.parentEmail}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue login process even if email sending fails
      }
    }

    const displayEmail = student.parentEmail.slice(0, 3) + '***@' + student.parentEmail.split('@')[1];
    return res.json({
      message: 'OTP generated successfully',
      studentId: student.id,
      emailToDisplay: displayEmail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 2: Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { studentId, otp } = req.body;

    if (!studentId || !otp) {
      return res.status(400).json({ message: 'Missing OTP or Context' });
    }

    const student = await Student.findOne({ id: studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Generate JWT
    const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      message: 'Login successful',
      token,
      student: {
        id: student.id,
        regNumber: student.regNumber,
        name: student.name,
        parentPhone: student.parentPhone,
        parentName: student.parentName,
        branch: student.branch,
        year: student.year,
        section: student.section,
        email: student.email,
        parentEmail: student.parentEmail,
        photo: student.photo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
