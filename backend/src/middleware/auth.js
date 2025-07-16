import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔍 Token decoded:', { userId: decoded.id });

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('❌ User not found for token');
        return res.status(401).json({
          status: 'error',
          message: 'Token is not valid. User not found.'
        });
      }

      console.log('👤 User found:', {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      });

      // Check if user account is active
      if (user.status !== 'active') {
        console.log('❌ User account not active:', user.status);
        return res.status(401).json({
          status: 'error',
          message: `Admin account is ${user.status}.`
        });
      }

      // Add user to request
      req.user = user;
      next();

    } catch (tokenError) {
      console.log('❌ Token verification failed:', tokenError.message);
      return res.status(401).json({
        status: 'error',
        message: 'Token is not valid.'
      });
    }

  } catch (error) {
    console.error('🚨 Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Please login first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Role ${req.user.role} not authorized. Required: ${roles.join(', ')}`);
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    console.log(`✅ User ${req.user.email} authorized with role: ${req.user.role}`);
    next();
  };
};

// Optional auth - don't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors for optional auth
        console.log('Optional auth token error (ignored):', error.message);
      }
    }

    next();
  } catch (error) {
    console.error('🚨 Optional auth error:', error);
    next();
  }
};
