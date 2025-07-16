import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  UserPlus,
  Trophy,
  AlertTriangle,
  FileText,
  Gift,
  Activity,
} from "lucide-react";
import adminApi from "@/services/adminApi";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  todayViews: number;
  newUsersToday: number;
  pendingPosts: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    todayViews: 0,
    newUsersToday: 0,
    pendingPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with real API calls
      setStats({
        totalUsers: 12543,
        activeUsers: 1834,
        totalPosts: 45,
        publishedPosts: 38,
        totalViews: 125430,
        todayViews: 2341,
        newUsersToday: 23,
        pendingPosts: 7,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "text-casino-gold",
      bgColor: "bg-casino-gold/10",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+8%",
      icon: Activity,
      color: "text-casino-neon",
      bgColor: "bg-casino-neon/10",
    },
    {
      title: "Blog Posts",
      value: stats.totalPosts.toString(),
      change: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "text-casino-neon-pink",
      bgColor: "bg-casino-neon-pink/10",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: `+${stats.todayViews} today`,
      icon: Eye,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
  ];

  const quickActions = [
    {
      title: "Create New Post",
      description: "Write a new blog post",
      icon: FileText,
      action: () => (window.location.href = "/admin/posts/create"),
      color:
        "border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black",
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: Users,
      action: () => (window.location.href = "/admin/users"),
      color:
        "border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black",
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: TrendingUp,
      action: () => (window.location.href = "/admin/analytics"),
      color:
        "border-casino-neon-pink text-casino-neon-pink hover:bg-casino-neon-pink hover:text-black",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "post",
      message: 'New blog post published: "Casino Strategies"',
      time: "2 hours ago",
      icon: FileText,
    },
    {
      id: 2,
      type: "user",
      message: "New user registered: john_doe",
      time: "4 hours ago",
      icon: UserPlus,
    },
    {
      id: 3,
      type: "post",
      message: 'Post updated: "Blackjack Tips"',
      time: "6 hours ago",
      icon: FileText,
    },
    {
      id: 4,
      type: "alert",
      message: "Server maintenance completed",
      time: "1 day ago",
      icon: AlertTriangle,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="casino-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-casino-gold/20 to-casino-neon/20 rounded-lg p-6 border border-casino-gold/30">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-300">
          Manage your casino platform efficiently with real-time insights and
          controls.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="casino-card hover:scale-105 transition-transform duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 ${action.color}`}
                  onClick={action.action}
                >
                  <action.icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-70">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50"
                  >
                    <div className="p-2 rounded-full bg-casino-gold/20">
                      <activity.icon className="h-4 w-4 text-casino-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Server Status</p>
                <p className="text-green-400 text-sm">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Database</p>
                <p className="text-green-400 text-sm">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Pending Tasks</p>
                <p className="text-yellow-400 text-sm">
                  {stats.pendingPosts} posts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
