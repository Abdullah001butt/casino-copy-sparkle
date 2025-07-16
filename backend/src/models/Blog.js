import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  
  // Categories
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: [
      'game-guides',
      'strategies', 
      'news',
      'winner-stories',
      'industry-updates',
      'new-releases',
      'tips-tricks',
      'responsible-gambling'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },

  // Media
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],

  // SEO
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [String],

  // Status & Publishing
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  scheduledFor: Date,

  // Engagement
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },

  // Comments (if you want comments)
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  commentsCount: {
    type: Number,
    default: 0
  },

  // Featured & Trending
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isSticky: {
    type: Boolean,
    default: false
  },

  // Reading Time
  readingTime: {
    type: Number, // in minutes
    default: 0
  },

  // REMOVED: Related Content section (relatedGames, relatedBonuses)

  // Analytics
  analytics: {
    avgTimeOnPage: Number,
    bounceRate: Number,
    clickThroughRate: Number,
    conversionRate: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isFeatured: 1, status: 1 });
blogSchema.index({ isTrending: 1, status: 1 });

// Text search index
blogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

// Virtual for formatted publish date
blogSchema.virtual('formattedPublishDate').get(function() {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for reading time calculation
blogSchema.virtual('estimatedReadingTime').get(function() {
  if (!this.content) return 0;
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Pre-save middleware
blogSchema.pre('save', function(next) {
  // Auto-generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate reading time
  if (this.isModified('content')) {
    this.readingTime = this.estimatedReadingTime;
  }

  // Auto-generate meta fields if not provided
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title.length > 60 ? 
      this.title.substring(0, 57) + '...' : 
      this.title;
  }

  if (!this.metaDescription && this.excerpt) {
    this.metaDescription = this.excerpt.length > 160 ? 
      this.excerpt.substring(0, 157) + '...' : 
      this.excerpt;
  }

  next();
});

// Static methods
blogSchema.statics.getPublished = function() {
  return this.find({ 
    status: 'published',
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

blogSchema.statics.getFeatured = function() {
  return this.find({ 
    status: 'published',
    isFeatured: true,
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

blogSchema.statics.getByCategory = function(category) {
  return this.find({ 
    status: 'published',
    category: category,
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

blogSchema.statics.getTrending = function() {
  return this.find({ 
    status: 'published',
    isTrending: true,
    publishedAt: { $lte: new Date() }
  }).sort({ views: -1, publishedAt: -1 });
};

// Instance methods
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

blogSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

blogSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

export default mongoose.model('Blog', blogSchema);
