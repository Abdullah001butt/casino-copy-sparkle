import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import adminApi from '@/services/adminApi';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  lastLogin?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!admin && adminApi.isAuthenticated();

  // Check if admin is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = adminApi.getToken();
        console.log('🔍 Checking auth status, token exists:', !!token);
        
        if (token) {
          console.log('🔄 Verifying token with server...');
          const response = await adminApi.getCurrentAdmin();
          
          if (response.status === 'success' && response.data?.user) {
            console.log('✅ Token valid, setting admin user');
            setAdmin(response.data.user);
          } else {
            console.log('❌ Invalid token response, clearing token');
            adminApi.removeToken();
          }
        } else {
          console.log('ℹ️ No token found');
        }
      } catch (error) {
        console.error('❌ Failed to verify admin token:', error);
        adminApi.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('🔐 Starting login process...');
      const response = await adminApi.login(credentials);
      
      if (response.status === 'success' && response.data) {
        const adminUser = response.data.user;
        console.log('✅ Login successful, setting admin user');
        setAdmin(adminUser);
        
        // Store user data in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      await adminApi.logout();
    } catch (error) {
      console.error('❌ Logout API error:', error);
    } finally {
      console.log('🧹 Clearing local state and storage');
      setAdmin(null);
      adminApi.removeToken();
      localStorage.removeItem('adminUser');
    }
  };

  const refreshAdmin = async () => {
    try {
      console.log('🔄 Refreshing admin data...');
      const response = await adminApi.getCurrentAdmin();
      
      if (response.status === 'success' && response.data?.user) {
        setAdmin(response.data.user);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        console.log('✅ Admin data refreshed');
      }
    } catch (error) {
      console.error('❌ Failed to refresh admin data:', error);
      logout();
    }
  };

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
