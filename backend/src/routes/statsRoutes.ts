import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protected dashboard stats endpoint (Admin only)
router.get('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getDashboardStats);

export default router;
