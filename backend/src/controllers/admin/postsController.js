import Blog from '../../models/Blog.js';
import { validationResult } from 'express-validator';

// @desc    Get all posts for admin
// @route   GET /api/admin/posts
// @access  Private (Admin/Moderator)
export const getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      author,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (author) {
      query.author = author;
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Execute query
    const posts = await Blog.find(query)
      .populate('author', 'username email profile.firstName profile.lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: totalPages,
        total
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch posts'
    });
  }
};

// @desc    Get single post by ID for admin
// @route   GET /api/admin/posts/:id
// @access  Private (Admin/Moderator)
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Blog.findById(id)
      .populate('author', 'username email profile.firstName profile.lastName')
      .populate('relatedGames', 'name slug')
      .populate('relatedBonuses', 'name type');

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch post'
    });
  }
};

// @desc    Create new post
// @route   POST /api/admin/posts
// @access  Private (Admin/Moderator)
export const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const postData = {
      ...req.body,
      author: req.user._id,
      authorName: req.user.username || `${req.user.profile?.firstName || ''} ${req.user.profile?.lastName || ''}`.trim()
    };

    const post = await Blog.create(postData);

    const populatedPost = await Blog.findById(post._id)
      .populate('author', 'username email profile.firstName profile.lastName');

    res.status(201).json({
      status: 'success',
      data: {
        post: populatedPost
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Post with this slug already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create post'
    });
  }
};

// @desc    Update post
// @route   PUT /api/admin/posts/:id
// @access  Private (Admin/Moderator)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if user can edit this post
    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to edit this post'
      });
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username email profile.firstName profile.lastName');

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Post with this slug already exists'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update post'
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin/Moderator)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Blog.findById(id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Check if user can delete this post
    if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this post'
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete post'
    });
  }
};

// @desc    Bulk update posts
// @route   PATCH /api/admin/posts/bulk
// @access  Private (Admin/Moderator)
export const bulkUpdatePosts = async (req, res) => {
  try {
    const { postIds, updates } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Post IDs are required'
      });
    }

    const result = await Blog.updateMany(
      { _id: { $in: postIds } },
      updates
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} posts updated successfully`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Bulk update posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update posts'
    });
  }
};

// @desc    Bulk delete posts
// @route   DELETE /api/admin/posts/bulk
// @access  Private (Admin/Moderator)
export const bulkDeletePosts = async (req, res) => {
  try {
    const { postIds } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Post IDs are required'
      });
    }

    const result = await Blog.deleteMany({
      _id: { $in: postIds }
    });

    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} posts deleted successfully`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Bulk delete posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete posts'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin/Moderator)
export const getDashboardStats = async (req, res) => {
  try {
    const totalPosts = await Blog.countDocuments();
    const publishedPosts = await Blog.countDocuments({ status: 'published' });
    const draftPosts = await Blog.countDocuments({ status: 'draft' });
    
    // Get total views and likes
    const viewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalLikes: { $sum: '$likes' } } }
    ]);
    
    const totalViews = viewsResult[0]?.totalViews || 0;
    const totalLikes = viewsResult[0]?.totalLikes || 0;

    // Mock data for other stats
    const stats = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      totalUsers: 1250, // Mock data
      todayViews: 234,   // Mock data
      weeklyGrowth: 12.5 // Mock data
    };

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard stats'
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/dashboard/analytics
// @access  Private (Admin/Moderator)
export const getAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Mock analytics data
    const mockAnalytics = [
      { date: '2024-01-14', views: 450, posts: 2, users: 34 },
      { date: '2024-01-15', views: 520, posts: 1, users: 45 },
      { date: '2024-01-16', views: 480, posts: 3, users: 38 },
      { date: '2024-01-17', views: 610, posts: 1, users: 52 },
      { date: '2024-01-18', views: 550, posts: 2, users: 41 },
      { date: '2024-01-19', views: 580, posts: 1, users: 47 },
      { date: '2024-01-20', views: 630, posts: 2, users: 55 }
    ];

    res.status(200).json({
      status: 'success',
      data: mockAnalytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch analytics'
    });
  }
};
