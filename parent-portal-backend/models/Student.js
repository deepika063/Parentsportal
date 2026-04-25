import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  regNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentName: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  section: { type: String, required: true },
  email: { type: String, required: true },
  parentEmail: { type: String, required: true },
  photo: { type: String, default: null },
  otp: { type: String }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
