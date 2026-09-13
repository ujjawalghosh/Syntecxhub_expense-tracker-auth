import { Router } from 'express';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', async (req, res, next) => { try { res.json(await Expense.find({ user: req.user.id }).sort({ date: -1 })); } catch (error) { next(error); } });
router.post('/', async (req, res, next) => {
	try {
		const { title, amount, type, category, date, note } = req.body;
		const expense = await Expense.create({ title, amount, type, category, date, note, user: req.user.id });
		res.status(201).json(expense);
	} catch (error) { next(error); }
});
router.put('/:id', async (req, res, next) => { try { const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true }); if (!expense) return res.status(404).json({ message: 'Expense not found' }); res.json(expense); } catch (error) { next(error); } });
router.delete('/:id', async (req, res, next) => { try { const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id }); if (!expense) return res.status(404).json({ message: 'Expense not found' }); res.json({ message: 'Expense deleted' }); } catch (error) { next(error); } });
export default router;
