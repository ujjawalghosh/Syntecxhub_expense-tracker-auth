import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured');
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => console.log(`API listening on port ${port}`));
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
start();
