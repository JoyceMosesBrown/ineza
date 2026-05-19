import { Router } from 'express';
import { register, login, chwLogin } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/chw/login', chwLogin);

export default router;
