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
  getTrendingBlogs
} from '../../controllers/blogController.js';
import Blog from '../../models/Blog.js';
import { protect, authorize } from '../../middleware/auth.js';
import { validateBlogCreate, validateBlogUpdate } from '../../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication
router.use(protect);
router.use(authorize('admin', 'moderator'));

// Admin blog management routes
router.get('/', getBlogs); // GET /api/admin/posts
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/:id', getBlog);
router.post('/', validateBlogCreate, createBlog);
router.put('/:id', validateBlogUpdate, updateBlog);
router.delete('/:id', deleteBlog);

// Additional admin-specific routes
router.patch('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { 
        status: 'published',
        publishedAt: new Date()
      },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to publish post'
    });
  }
});

router.patch('/:id/unpublish', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { status: 'draft' },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { blog }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to unpublish post'
    });
  }
});

// Bulk operations
router.delete('/bulk', async (req, res) => {
  try {
    const { postIds } = req.body;
    
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Post IDs are required'
      });
    }

    await Blog.deleteMany({ _id: { $in: postIds } });

    res.status(200).json({
      status: 'success',
      message: `${postIds.length} posts deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete posts'
    });
  }
});

router.patch('/bulk', async (req, res) => {
  try {
    const { postIds, updates } = req.body;
    
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Post IDs are required'
      });
    }

    await Blog.updateMany(
      { _id: { $in: postIds } },
      { $set: updates }
    );

    res.status(200).json({
      status: 'success',
      message: `${postIds.length} posts updated successfully`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update posts'
    });
  }
});

export default router;
