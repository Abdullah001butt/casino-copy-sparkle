import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testPassword = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user with password field
    const admin = await User.findOne({ email: 'admin@casino.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('👤 Found admin user:', admin.email);
    console.log('🔐 Stored password hash:', admin.password.substring(0, 20) + '...');

    // Test password comparison
    const testPasswords = ['admin123', 'Admin123', 'ADMIN123'];
    
    for (const testPassword of testPasswords) {
      console.log(`\n🧪 Testing password: "${testPassword}"`);
      try {
        const isMatch = await admin.comparePassword(testPassword);
        console.log(`✅ Password "${testPassword}" match:`, isMatch);
      } catch (error) {
        console.log(`❌ Error testing password "${testPassword}":`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error testing password:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

testPassword();
