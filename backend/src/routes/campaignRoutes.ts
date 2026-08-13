import { Router } from 'express';
import {
  getStates,
  createState,
  getDistricts,
  createDistrict,
  getInstitutions,
  createInstitution,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Geography endpoints (Public)
router.get('/states', getStates);
router.get('/districts', getDistricts);
router.get('/institutions', getInstitutions);

// Geography modification (Admin only)
router.post('/states', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createState);
router.post('/districts', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createDistrict);
router.post('/institutions', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createInstitution);

// Campaign endpoints (Public read)
router.get('/', getCampaigns);

// Campaign modifications (Admin only)
router.post('/', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), createCampaign);
router.put('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateCampaign);
router.delete('/:id', authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteCampaign);

export default router;
