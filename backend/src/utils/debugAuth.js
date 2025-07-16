export const debugAuth = () => {
  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");
  
  console.log('🔍 Auth Debug Info:');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
  console.log('Admin user exists:', !!adminUser);
  
  if (adminUser) {
    try {
      const user = JSON.parse(adminUser);
      console.log('Admin user:', {
        email: user.email,
        role: user.role,
        status: user.status
      });
    } catch (e) {
      console.log('Error parsing admin user:', e);
    }
  }
  
  return { token, adminUser };
};
