import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // Global contacts document since it's shared across students,
  // we could just store it as a single document in a 'contacts' collection.
  type: { type: String, required: true }, // 'counsellor' | 'faculty' | 'administration'
  contactId: { type: Number, required: true }, // original id from frontend
  
  // common fields
  name: String,
  email: String,
  phone: String,
  cabin: String,
  
  // specific fields
  designation: String,
  department: String,
  availability: String,
  photo: String, // String or null
  subject: String,
  code: String
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
