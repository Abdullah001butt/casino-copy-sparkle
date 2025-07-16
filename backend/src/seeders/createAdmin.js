import mongoose from 'mongoose';
import User from "../models/User.js"
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@casino.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@casino.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      isVerified: true,
      isActive: true,
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@casino.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
