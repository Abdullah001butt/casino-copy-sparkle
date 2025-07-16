import express from 'express';
import { 
  adminLogin, 
  adminLogout, 
  getCurrentAdmin
} from '../../controllers/admin/authController.js';
import { protect, authorize } from '../../middleware/auth.js';
import { validateLogin } from '../../middleware/validation.js';

const router = express.Router();

// Public admin auth routes
router.post('/login', validateLogin, adminLogin);

// Protected admin routes
router.use(protect); // All routes below require authentication
router.use(authorize('admin', 'moderator')); // Require admin/moderator role

router.post('/logout', adminLogout);
router.get('/me', getCurrentAdmin);

export default router;
