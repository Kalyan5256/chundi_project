import { Router } from 'express';
import {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from '../controllers/trainerController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllTrainers);
router.get('/:id', getTrainerById);

// Admin-only routes
router.post('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createTrainer);
router.put('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateTrainer);
router.delete('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteTrainer);

export default router;
