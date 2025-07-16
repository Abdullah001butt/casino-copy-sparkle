import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import ProtectedRoute from "@/components/ProtectedRoute";

// Import your pages and components
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminPosts from "./components/Admin/AdminPosts";
import AdminCreatePost from "./components/Admin/AdminCreatePost";
import AdminEditPost from "./components/Admin/AdminEditPost";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminAnalytics from "./components/Admin/AdminAnalytics";
import AdminSettings from "./components/Admin/AdminSettings";
import Dashboard from "./components/Admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Admin Login Route (Public) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard Routes */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              
              {/* Posts Management - All admin roles */}
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/create" element={<AdminCreatePost />} />
              <Route path="posts/edit/:id" element={<AdminEditPost />} />
              
              {/* User Management - Admin and Moderator only */}
              <Route path="users" element={
                <ProtectedRoute requiredRole={['admin', 'moderator']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              
              {/* Games Management - Admin and Moderator only */}
              <Route path="games" element={
                <ProtectedRoute requiredRole={['admin', 'moderator']}>
                  <div className="text-white p-6">
                    <h1 className="text-3xl font-bold mb-4">Games Management</h1>
                    <div className="casino-card p-6">
                      <p className="text-gray-300 mb-4">Games management system coming soon...</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-gold/20">
                          <h3 className="text-casino-gold font-semibold mb-2">🎰 Slot Games</h3>
                          <p className="text-gray-400 text-sm">Manage slot machine games</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon/20">
                          <h3 className="text-casino-neon font-semibold mb-2">🃏 Table Games</h3>
                          <p className="text-gray-400 text-sm">Manage table games</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon-pink/20">
                          <h3 className="text-casino-neon-pink font-semibold mb-2">🎮 Live Casino</h3>
                          <p className="text-gray-400 text-sm">Manage live dealer games</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Bonuses Management - Admin and Moderator only */}
              <Route path="bonuses" element={
                <ProtectedRoute requiredRole={['admin', 'moderator']}>
                  <div className="text-white p-6">
                    <h1 className="text-3xl font-bold mb-4">Bonuses Management</h1>
                    <div className="casino-card p-6">
                      <p className="text-gray-300 mb-4">Bonus management system coming soon...</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-gold/20">
                          <h3 className="text-casino-gold font-semibold mb-2">🎁 Welcome Bonus</h3>
                          <p className="text-gray-400 text-sm">Manage welcome bonuses</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon/20">
                          <h3 className="text-casino-neon font-semibold mb-2">🔄 Reload Bonus</h3>
                          <p className="text-gray-400 text-sm">Manage reload bonuses</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon-pink/20">
                          <h3 className="text-casino-neon-pink font-semibold mb-2">💰 Cashback</h3>
                          <p className="text-gray-400 text-sm">Manage cashback offers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Transactions - Admin and Moderator only */}
              <Route path="transactions" element={
                <ProtectedRoute requiredRole={['admin', 'moderator']}>
                  <div className="text-white p-6">
                    <h1 className="text-3xl font-bold mb-4">Transactions</h1>
                    <div className="casino-card p-6">
                      <p className="text-gray-300 mb-4">Transaction management system coming soon...</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/20">
                          <h3 className="text-green-400 font-semibold mb-2">💳 Deposits</h3>
                          <p className="text-gray-400 text-sm">Manage user deposits</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-red/20">
                          <h3 className="text-casino-red font-semibold mb-2">💸 Withdrawals</h3>
                          <p className="text-gray-400 text-sm">Manage user withdrawals</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-gold/20">
                          <h3 className="text-casino-gold font-semibold mb-2">📊 Reports</h3>
                          <p className="text-gray-400 text-sm">Financial reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Analytics - All admin roles */}
              <Route path="analytics" element={<AdminAnalytics />} />
              
              {/* Settings - Admin only */}
              <Route path="settings" element={
                <ProtectedRoute requiredRole={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* Profile Management */}
              <Route path="profile" element={
                <div className="text-white p-6">
                  <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>
                  <div className="casino-card p-6">
                    <p className="text-gray-300 mb-4">Profile management coming soon...</p>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-gold/20">
                        <h3 className="text-casino-gold font-semibold mb-2">👤 Personal Information</h3>
                        <p className="text-gray-400 text-sm">Update your personal details</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon/20">
                        <h3 className="text-casino-neon font-semibold mb-2">🔒 Security</h3>
                        <p className="text-gray-400 text-sm">Change password and security settings</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon-pink/20">
                        <h3 className="text-casino-neon-pink font-semibold mb-2">🔔 Notifications</h3>
                        <p className="text-gray-400 text-sm">Manage notification preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              
              {/* Support/Help */}
              <Route path="support" element={
                <div className="text-white p-6">
                  <h1 className="text-3xl font-bold mb-4">Support & Help</h1>
                  <div className="casino-card p-6">
                    <p className="text-gray-300 mb-4">Support system coming soon...</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-gold/20">
                        <h3 className="text-casino-gold font-semibold mb-2">📚 Documentation</h3>
                        <p className="text-gray-400 text-sm">Admin panel documentation</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon/20">
                        <h3 className="text-casino-neon font-semibold mb-2">🎫 Support Tickets</h3>
                        <p className="text-gray-400 text-sm">Create and manage support tickets</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-casino-neon-pink/20">
                        <h3 className="text-casino-neon-pink font-semibold mb-2">💬 Live Chat</h3>
                        <p className="text-gray-400 text-sm">Chat with support team</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/20">
                        <h3 className="text-green-400 font-semibold mb-2">📞 Contact Info</h3>
                        <p className="text-gray-400 text-sm">Emergency contact information</p>
                      </div>
                    </div>
                  </div>
                </div>
              } />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-casino-gold mb-4">404</h1>
                  <p className="text-white text-xl mb-4">Page Not Found</p>
                  <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                  <div className="space-x-4">
                    <a 
                      href="/" 
                      className="inline-block bg-casino-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-casino-gold/90 transition-colors"
                    >
                      Return to Home
                    </a>
                    <a 
                      href="/admin" 
                      className="inline-block border border-casino-neon text-casino-neon px-6 py-3 rounded-lg font-semibold hover:bg-casino-neon hover:text-black transition-colors"
                    >
                      Admin Panel
                    </a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
