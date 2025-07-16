import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  bulkUpdatePosts,
  bulkDeletePosts
} from '../../controllers/admin/postsController.js';
import { protect, authorize } from '../../middleware/auth.js';
import { validateBlogCreate, validateBlogUpdate } from '../../middleware/validation.js';

const router = express.Router();

// All routes require authentication and admin/moderator role
router.use(protect);
router.use(authorize('admin', 'moderator'));

// Posts routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', validateBlogCreate, createPost);
router.put('/:id', validateBlogUpdate, updatePost);
router.delete('/:id', deletePost);

// Bulk operations
router.patch('/bulk', bulkUpdatePosts);
router.delete('/bulk', bulkDeletePosts);

export default router;
