import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@casino.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('👤 Found admin user:', admin.email);
    console.log('🔄 Resetting password...');

    // Update password (this will trigger the pre-save hook to hash it)
    admin.password = 'admin123';
    await admin.save();

    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: admin@casino.com');
    console.log('🔑 New Password: admin123');
    console.log('👤 Role:', admin.role);

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

resetAdminPassword();
