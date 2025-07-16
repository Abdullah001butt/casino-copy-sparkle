import User from '../../models/User.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      role,
      sort = '-createdAt'
    } = req.query;

    console.log('👥 Fetching users with params:', req.query);

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (role) query.role = role;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Execute query
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`✅ Found ${users.length} users out of ${total} total`);

    res.status(200).json({
      status: 'success',
      results: users.length,
      totalResults: total,
      totalPages,
      currentPage: parseInt(page),
      data: {
        users
      }
    });
  } catch (error) {
    console.error('🚨 Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('🚨 Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates._id;
    delete updates.__v;
    
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('🚨 Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('🚨 Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};

// @desc    Toggle user status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Toggle status
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    user.status = newStatus;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('🚨 Toggle user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle user status'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private (Admin)
export const getUserStats = async (req, res) => {
  try {
    console.log('📊 Fetching user statistics...');

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    const vipUsers = await User.countDocuments({ role: 'vip' });
    
    // New users today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const stats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      bannedUsers,
      vipUsers,
      newUsersToday
    };

    console.log('✅ User stats fetched:', stats);

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('🚨 User stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user statistics'
    });
  }
};
