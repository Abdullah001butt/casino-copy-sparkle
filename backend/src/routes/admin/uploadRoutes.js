import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Upload endpoint is working' });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'blog';
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
    
    console.log('📁 Upload destination:', uploadPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log('✅ Created upload directory:', uploadPath);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 File filter check:', { 
      originalname: file.originalname, 
      mimetype: file.mimetype 
    });
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('✅ File type validation passed');
      return cb(null, true);
    } else {
      console.log('❌ File type validation failed');
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Protected routes - Admin/Moderator only
router.use(protect);
router.use(authorize('admin', 'moderator'));

// Upload single image
router.post('/image', (req, res) => {
  console.log('📤 Image upload request received');
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    try {
      if (!req.file) {
        console.log('❌ No file in request');
        return res.status(400).json({
          status: 'error',
          message: 'No image file provided'
        });
      }

      const folder = req.body.folder || 'blog';
      const imageUrl = `/uploads/${folder}/${req.file.filename}`;
      
      console.log('✅ File uploaded successfully:', {
        filename: req.file.filename,
        path: req.file.path,
        url: imageUrl
      });

      res.status(200).json({
        status: 'success',
        data: {
          url: imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          path: req.file.path
        }
      });
    } catch (error) {
      console.error('❌ Image upload error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload image'
      });
    }
  });
});

// Upload multiple images
router.post('/images', (req, res) => {
  console.log('📤 Multiple images upload request received');
  
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        console.log('❌ No files in request');
        return res.status(400).json({
          status: 'error',
          message: 'No image files provided'
        });
      }

      const folder = req.body.folder || 'blog';
      const uploadedFiles = req.files.map(file => ({
        url: `/uploads/${folder}/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        path: file.path
      }));
      
      console.log('✅ Files uploaded successfully:', uploadedFiles.length);

      res.status(200).json({
        status: 'success',
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length
        }
      });
    } catch (error) {
      console.error('❌ Multiple images upload error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload images'
      });
    }
  });
});

// Delete uploaded image
router.delete('/image', (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Image URL is required'
      });
    }

    // Extract file path from URL
    const filePath = path.join(process.cwd(), imageUrl);
    
    console.log('🗑️ Attempting to delete file:', filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted successfully:', filePath);
      
      res.status(200).json({
        status: 'success',
        message: 'Image deleted successfully'
      });
    } else {
      console.log('❌ File not found:', filePath);
      res.status(404).json({
        status: 'error',
        message: 'Image file not found'
      });
    }
  } catch (error) {
    console.error('❌ Delete image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image'
    });
  }
});

// Get uploaded files list
router.get('/files', (req, res) => {
  try {
    const { folder = 'blog' } = req.query;
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
    
    console.log('📁 Listing files in:', uploadPath);

    if (!fs.existsSync(uploadPath)) {
      return res.status(200).json({
        status: 'success',
        data: {
          files: [],
          count: 0
        }
      });
    }

    const files = fs.readdirSync(uploadPath).map(filename => {
      const filePath = path.join(uploadPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        url: `/uploads/${folder}/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        files,
        count: files.length
      }
    });
  } catch (error) {
    console.error('❌ Get files error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get files list'
    });
  }
});

// Create upload folder
router.post('/folder', (req, res) => {
  try {
    const { folderName } = req.body;
    
    if (!folderName) {
      return res.status(400).json({
        status: 'error',
        message: 'Folder name is required'
      });
    }

    const folderPath = path.join(process.cwd(), 'uploads', folderName);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log('✅ Created folder:', folderPath);
      
      res.status(201).json({
        status: 'success',
        message: 'Folder created successfully',
        data: {
          folderName,
          path: folderPath
        }
      });
    } else {
      res.status(409).json({
        status: 'error',
        message: 'Folder already exists'
      });
    }
  } catch (error) {
    console.error('❌ Create folder error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create folder'
    });
  }
});

export default router;
