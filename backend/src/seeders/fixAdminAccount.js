import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixAdminAccount = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@casino.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const newAdmin = await User.create({
        username: 'admin',
        email: 'admin@casino.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        }
      });
      
      console.log('✅ New admin user created!');
      console.log('📧 Email:', newAdmin.email);
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', newAdmin.role);
      console.log('🟢 Status:', newAdmin.status);
      
    } else {
      console.log('👤 Found admin user:', admin.email);
      console.log('🔍 Current status:', admin.status);
      console.log('👤 Current role:', admin.role);
      
      // Fix the admin account
      let needsUpdate = false;
      
      if (admin.status !== 'active') {
        admin.status = 'active';
        needsUpdate = true;
        console.log('🔧 Setting status to active...');
      }
      
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        needsUpdate = true;
        console.log('🔧 Setting role to admin...');
      }
      
      // Reset password to make sure it works
      admin.password = 'admin123';
      needsUpdate = true;
      console.log('🔧 Resetting password...');
      
      if (needsUpdate) {
        await admin.save();
        console.log('✅ Admin account updated successfully!');
      } else {
        console.log('✅ Admin account is already properly configured!');
      }
      
      console.log('📧 Email: admin@casino.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role:', admin.role);
      console.log('🟢 Status:', admin.status);
    }

  } catch (error) {
    console.error('❌ Error fixing admin account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  }
};

fixAdminAccount();
