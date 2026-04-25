import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  upcomingExams: [{
    id: Number,
    subject: String,
    code: String,
    date: String,
    time: String,
    venue: String,
    type: { type: String } // 'type' is a reserved mongoose keyword, so { type: String } must be used
  }],
  academicCalendar: [{
    id: Number,
    event: String,
    startDate: String,
    endDate: String,
    type: { type: String }
  }],
  general: [{
    id: Number,
    title: String,
    message: String,
    date: String,
    priority: String
  }]
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
