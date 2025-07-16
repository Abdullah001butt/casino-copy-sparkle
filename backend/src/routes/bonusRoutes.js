import express from 'express';
import {
  getAllBonuses,
  getBonus,
  claimBonus,
  getWelcomeBonuses,
} from '../controllers/bonusController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateBonusClaim } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllBonuses);
router.get('/welcome', getWelcomeBonuses);
router.get('/:id', getBonus);

// Protected routes
router.use(protect); // All routes after this require authentication

router.post('/claim', validateBonusClaim, claimBonus);

export default router;
