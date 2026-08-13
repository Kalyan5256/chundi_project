import { Router } from 'express';
import {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
} from '../controllers/awardController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAwards);

// Admin-only routes
router.post('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createAward);
router.put('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateAward);
router.delete('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteAward);

export default router;
