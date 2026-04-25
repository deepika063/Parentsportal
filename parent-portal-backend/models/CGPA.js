import mongoose from 'mongoose';

const cgpaSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  overallCGPA: { type: Number, required: true },
  yearWise: [{
    year: String,
    cgpa: Number
  }],
  semesterWise: [{
    sem: String,
    sgpa: Number,
    credits: Number
  }],
  subjectWise: [{
    subject: String,
    code: String,
    sem: String,
    internal: Number,
    external: Number,
    total: Number,
    max: Number,
    grade: String,
    credits: Number,
    gradePoint: Number
  }]
}, { timestamps: true });

export default mongoose.model('CGPA', cgpaSchema);
