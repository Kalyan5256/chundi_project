import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateJWT, me);

export default router;
