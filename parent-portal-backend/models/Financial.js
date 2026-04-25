import mongoose from 'mongoose';

const financialSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  totalFee: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  pendingAmount: { type: Number, required: true },
  dueDate: String,
  scholarship: {
    eligible: Boolean,
    type: { type: String },
    amount: Number,
    status: String,
    disbursed: Boolean,
    disbursedDate: String
  },
  paymentHistory: [{
    id: String,
    date: String,
    amount: Number,
    mode: String,
    status: String,
    receipt: String
  }],
  feeBreakup: [{
    item: String,
    amount: Number
  }]
}, { timestamps: true });

export default mongoose.model('Financial', financialSchema);
