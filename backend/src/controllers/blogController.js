import Blog from "../models/Blog.js";
import { validationResult } from "express-validator";

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      featured,
      trending,
      search,
      author,
      status = "published",
    } = req.query;

    // Build query
    const query = {};

    // Only show published blogs for public access
    if (!req.user || req.user.role !== "admin") {
      query.status = "published";
      query.publishedAt = { $lte: new Date() };
    } else if (status) {
      query.status = status;
    }

    if (category) query.category = category;
    if (author) query.author = author;
    if (featured === "true") query.isFeatured = true;
    if (trending === "true") query.isTrending = true;

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Build sort
    let sort = { publishedAt: -1 };
    if (search) {
      sort = { score: { $meta: "textScore" }, publishedAt: -1 };
    }
    if (trending === "true") {
      sort = { views: -1, publishedAt: -1 };
    }

    // Execute query - REMOVED relatedGames populate
    const blogs = await Blog.find(query)
      .populate("author", "username profile.firstName profile.lastName")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content"); // Exclude full content for list view

    res.status(200).json({
      status: "success",
      results: blogs.length,
      totalResults: total,
      totalPages,
      currentPage: parseInt(page),
      data: {
        blogs,
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch blogs",
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      ...((!req.user || req.user.role !== "admin") && {
        status: "published",
        publishedAt: { $lte: new Date() },
      }),
    }).populate(
      "author",
      "username profile.firstName profile.lastName profile.avatar"
    );
    // REMOVED relatedGames populate

    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    // Increment views (don't await to avoid slowing response)
    blog
      .incrementViews()
      .catch((err) => console.error("Failed to increment views:", err));

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch blog post",
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin/Author)
export const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blogData = {
      ...req.body,
      author: req.user._id,
      authorName:
        req.user.username ||
        `${req.user.profile.firstName} ${req.user.profile.lastName}`.trim(),
    };

    const blog = await Blog.create(blogData);

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "username profile.firstName profile.lastName"
    );
    // REMOVED relatedGames populate

    res.status(201).json({
      status: "success",
      data: {
        blog: populatedBlog,
      },
    });
  } catch (error) {
    console.error("Create blog error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Blog with this slug already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to create blog post",
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin/Author)
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    // Check if user can edit this blog
    if (
      req.user.role !== "admin" &&
      blog.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to edit this blog post",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "username profile.firstName profile.lastName");
    // REMOVED relatedGames populate

    res.status(200).json({
      status: "success",
      data: {
        blog: updatedBlog,
      },
    });
  } catch (error) {
    console.error("Update blog error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Blog with this slug already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to update blog post",
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin/Author)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    // Check if user can delete this blog
    if (
      req.user.role !== "admin" &&
      blog.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this blog post",
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete blog post",
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          latestPost: { $max: "$publishedAt" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const categoryInfo = {
      "game-guides": {
        name: "Game Guides",
        description: "Learn how to play casino games",
      },
      strategies: {
        name: "Strategies",
        description: "Winning strategies and tips",
      },
      news: { name: "News", description: "Latest casino industry news" },
      "winner-stories": {
        name: "Winner Stories",
        description: "Success stories from players",
      },
      "industry-updates": {
        name: "Industry Updates",
        description: "Casino industry insights",
      },
      "new-releases": {
        name: "New Releases",
        description: "Latest game releases",
      },
      "tips-tricks": {
        name: "Tips & Tricks",
        description: "Pro tips for better gaming",
      },
      "responsible-gambling": {
        name: "Responsible Gambling",
        description: "Safe gaming practices",
      },
    };

    const enrichedCategories = categories.map((cat) => ({
      category: cat._id,
      count: cat.count,
      latestPost: cat.latestPost,
      ...categoryInfo[cat._id],
    }));

    res.status(200).json({
      status: "success",
      data: {
        categories: enrichedCategories,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch blog categories",
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/blogs/tags
// @access  Public
export const getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        tags: tags.map((tag) => ({
          name: tag._id,
          count: tag.count,
        })),
      },
    });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch blog tags",
    });
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({
      status: "published",
      isFeatured: true,
      publishedAt: { $lte: new Date() },
    })
      .populate("author", "username profile.firstName profile.lastName")
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .select("-content");

    res.status(200).json({
      status: "success",
      results: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    console.error("Get featured blogs error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch featured blogs",
    });
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
export const getTrendingBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({
      status: "published",
      publishedAt: { $lte: new Date() },
    })
      .populate("author", "username profile.firstName profile.lastName")
      .sort({ views: -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .select("-content");

    res.status(200).json({
      status: "success",
      results: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    console.error("Get trending blogs error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch trending blogs",
    });
  }
};

// @desc    Get related blogs
// @route   GET /api/blogs/:id/related
// @access  Public
export const getRelatedBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const currentBlog = await Blog.findById(id);
    if (!currentBlog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    // Find related blogs based on category and tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: id },
      status: "published",
      publishedAt: { $lte: new Date() },
      $or: [
        { category: currentBlog.category },
        { tags: { $in: currentBlog.tags } },
      ],
    })
      .populate("author", "username profile.firstName profile.lastName")
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .select("-content");

    res.status(200).json({
      status: "success",
      results: relatedBlogs.length,
      data: {
        blogs: relatedBlogs,
      },
    });
  } catch (error) {
    console.error("Get related blogs error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch related blogs",
    });
  }
};

// @desc    Like a blog post
// @route   POST /api/blogs/:id/like
// @access  Public
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    await blog.incrementLikes();

    res.status(200).json({
      status: "success",
      message: "Blog post liked successfully",
      data: {
        likes: blog.likes + 1,
      },
    });
  } catch (error) {
    console.error("Like blog error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to like blog post",
    });
  }
};

// @desc    Share a blog post
// @route   POST /api/blogs/:id/share
// @access  Public
export const shareBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        status: "error",
        message: "Blog post not found",
      });
    }

    await blog.incrementShares();

    res.status(200).json({
      status: "success",
      message: "Blog shared successfully",
      data: {
        shares: blog.shares + 1,
      },
    });
  } catch (error) {
    console.error("Share blog error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to share blog post",
    });
  }
};
