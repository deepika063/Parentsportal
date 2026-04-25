import mongoose from 'mongoose';

const academicSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  totalCredits: { type: Number, required: true },
  earnedCredits: { type: Number, required: true },
  backlogs: [{
    subject: String,
    code: String,
    semester: String,
    attempts: Number
  }],
  repeatedSubjects: [{
    subject: String,
    code: String,
    originalSem: String,
    retakeIn: String,
    cleared: Boolean
  }],
  incompleteSubjects: [{
    subject: String,
    code: String,
    status: String,
    deadline: String
  }],
  courseCompletion: {
    totalSemesters: Number,
    completedSemesters: Number,
    percentage: Number,
    expectedGraduation: String
  }
}, { timestamps: true });

export default mongoose.model('Academic', academicSchema);
