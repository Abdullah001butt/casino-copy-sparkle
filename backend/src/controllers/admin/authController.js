import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    console.log('👤 User found:', {
      email: user.email,
      role: user.role,
      status: user.status
    });

    // Check if user is admin or moderator
    if (!['admin', 'moderator'].includes(user.role)) {
      console.log('❌ User is not admin/moderator:', user.role);
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      console.log('❌ Account is not active:', user.status);
      return res.status(401).json({
        status: 'error',
        message: `Admin account is ${user.status}. Please contact system administrator.`
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Admin login successful:', email);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: user.profile,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('🚨 Admin login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Admin logout
// @route   POST /api/auth/admin/logout
// @access  Private
export const adminLogout = async (req, res) => {
  try {
    console.log('🚪 Admin logout:', req.user.email);
    
    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('🚨 Admin logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get current admin
// @route   GET /api/auth/admin/me
// @access  Private
export const getCurrentAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: `Admin account is ${user.status}`
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: user.profile,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('🚨 Get current admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};
