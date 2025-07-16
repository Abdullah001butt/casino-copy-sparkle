import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Users, 
  GamepadIcon, 
  Gift, 
  BarChart3, 
  Settings, 
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-casino-gold mx-auto mb-4" />
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: location.pathname === '/admin' },
    { name: 'Posts', href: '/admin/posts', icon: FileText, current: location.pathname.startsWith('/admin/posts') },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname.startsWith('/admin/users') },
    { name: 'Games', href: '/admin/games', icon: GamepadIcon, current: location.pathname.startsWith('/admin/games') },
    { name: 'Bonuses', href: '/admin/bonuses', icon: Gift, current: location.pathname.startsWith('/admin/bonuses') },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: location.pathname.startsWith('/admin/analytics') },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: location.pathname.startsWith('/admin/settings') },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-casino-gold/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-casino-gold/20">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Crown className="h-8 w-8 text-casino-gold" />
                <Sparkles className="h-4 w-4 text-casino-neon absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold gold-gradient bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-casino-gold/20 text-casino-gold border border-casino-gold/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-casino-gold'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-casino-gold/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-casino-gold/20 rounded-full flex items-center justify-center">
                <span className="text-casino-gold font-semibold">
                  {admin?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{admin?.username}</p>
                <p className="text-gray-400 text-sm capitalize">{admin?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-casino-red text-casino-red hover:bg-casino-red hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-gray-900/50 border-b border-casino-gold/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">Welcome back,</span>
              <span className="text-casino-gold font-semibold">{admin?.username}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
