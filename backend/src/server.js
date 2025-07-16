import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database.js';

// Import routes
import adminAuthRoutes from './routes/admin/authRoutes.js';
import adminPostsRoutes from './routes/admin/postsRoutes.js';  // Add this
import uploadRoutes from './routes/admin/uploadRoutes.js';      // Add this
import blogRoutes from './routes/blogRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('📁 Static files served from:', uploadsPath);

// Routes
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/admin/posts', adminPostsRoutes);    // Add this
app.use('/api/admin/upload', uploadRoutes);       // Add this
app.use('/api/blogs', blogRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uploadsPath: uploadsPath
  });
});

// Test upload directory
app.get('/api/test-upload', (req, res) => {
  const fs = require('fs');
  const uploadExists = fs.existsSync(uploadsPath);
  
  res.json({
    uploadsPath,
    exists: uploadExists,
    permissions: uploadExists ? 'readable' : 'not accessible'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global Error:', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 Static files: http://localhost:${PORT}/uploads`);
  console.log(`🧪 Test upload: http://localhost:${PORT}/api/test-upload`);
  console.log(`📝 Admin posts: http://localhost:${PORT}/api/admin/posts`);
});
