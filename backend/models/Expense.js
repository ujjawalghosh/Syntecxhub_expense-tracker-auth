import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['expense', 'income'], default: 'expense' },
  category: { type: String, enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'], default: 'Other' },
  date: { type: Date, default: Date.now },
  note: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
