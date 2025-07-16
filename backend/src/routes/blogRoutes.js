import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  getBlogTags,
  getFeaturedBlogs,
  getTrendingBlogs,
  getRelatedBlogs,
  likeBlog,
  shareBlog
} from '../controllers/blogController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateBlogCreate, validateBlogUpdate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getBlogs);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);

// Blog interaction routes (public)
router.post('/:id/like', likeBlog);
router.post('/:id/share', shareBlog);
router.get('/:id/related', getRelatedBlogs);

// Single blog route (must be after other specific routes)
router.get('/:slug', optionalAuth, getBlog);

// Protected routes - Admin/Author only
router.use(protect); // All routes below require authentication

router.post('/', authorize('admin', 'moderator'), validateBlogCreate, createBlog);
router.put('/:id', authorize('admin', 'moderator'), validateBlogUpdate, updateBlog);
router.delete('/:id', authorize('admin', 'moderator'), deleteBlog);

export default router;
