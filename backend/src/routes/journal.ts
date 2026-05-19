import { Router } from 'express';
import { createEntry, getEntries, getEntryByDate } from '../controllers/journalController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.post('/', createEntry);
router.get('/', getEntries);
router.get('/:date', getEntryByDate);

export default router;
