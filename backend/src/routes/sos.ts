import { Router } from 'express';
import { triggerSOS, getAlerts, resolveAlert } from '../controllers/sosController';
import { protect, chwOnly } from '../middleware/auth';

const router = Router();

router.post('/', protect, triggerSOS);
router.get('/alerts', protect, chwOnly, getAlerts);
router.patch('/alerts/:id/resolve', protect, chwOnly, resolveAlert);

export default router;
