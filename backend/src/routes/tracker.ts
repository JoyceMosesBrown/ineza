import { Router } from 'express';
import { saveTrackerEntry, getTrackerEntries, getTrackerByDate } from '../controllers/trackerController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.post('/', saveTrackerEntry);
router.get('/', getTrackerEntries);
router.get('/:date', getTrackerByDate);

export default router;
