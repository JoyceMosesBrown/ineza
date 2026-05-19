import { Router } from 'express';
import { getAssignedUsers, getUserSummary } from '../controllers/chwController';
import { protect, chwOnly } from '../middleware/auth';

const router = Router();

router.use(protect, chwOnly);
router.get('/users', getAssignedUsers);
router.get('/users/:userId/summary', getUserSummary);

export default router;
