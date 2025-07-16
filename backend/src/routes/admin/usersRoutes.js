import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
} from '../../controllers/admin/usersController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(protect);
router.use(authorize('admin', 'moderator'));

// User statistics route (must be before /:id routes)
router.get('/stats', getUserStats);

// User CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// User action routes
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
