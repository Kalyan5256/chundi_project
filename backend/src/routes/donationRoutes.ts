import { Router } from 'express';
import { getDonationSettings, updateDonationSettings } from '../controllers/donationController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getDonationSettings);

// Admin-only routes
router.put('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateDonationSettings);

export default router;
