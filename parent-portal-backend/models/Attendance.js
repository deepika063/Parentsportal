import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' }, // reference by custom string `id`
  overall: { type: Number, required: true },
  semesterWise: [{
    sem: String,
    attendance: Number
  }],
  subjectWise: [{
    subject: String,
    code: String,
    attended: Number,
    total: Number,
    percent: Number
  }]
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
