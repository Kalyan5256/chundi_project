import { Router } from 'express';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public submission route
router.post('/', submitContactForm);

// Protected retrieval route (Admin only)
router.get('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getContactSubmissions);

export default router;
