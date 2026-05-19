import { Router } from 'express';
import { getMessages, postMessage, reactToMessage } from '../controllers/peersController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', getMessages);
router.post('/', postMessage);
router.patch('/:id/react', reactToMessage);

export default router;
