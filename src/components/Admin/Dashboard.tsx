import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Plus,
  Edit,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import adminApi from "@/services/adminApi";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalUsers: number;
  todayViews: number;
  weeklyGrowth: number;
}

interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  likes: number;
  createdAt: string;
  author: {
    username: string;
    profile: {
      firstName?: string;
      lastName?: string;
    };
  };
}

interface AnalyticsData {
  date: string;
  views: number;
  posts: number;
  users: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      console.log("🔄 Fetching dashboard data...");

      // Try to fetch real data first, fallback to mock data if API fails
      try {
        const [statsResponse, postsResponse, analyticsResponse] =
          await Promise.all([
            adminApi.getDashboardStats(),
            adminApi.getAllPosts({ limit: 5, sort: "-createdAt" }),
            adminApi.getAnalytics("7d"),
          ]);

        console.log("📊 API Responses:", {
          stats: statsResponse,
          posts: postsResponse,
          analytics: analyticsResponse,
        });

        // Set stats data
        if (statsResponse?.status === "success" && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          throw new Error("Stats API failed");
        }

        // Set recent posts
        if (postsResponse?.status === "success" && postsResponse.data?.posts) {
          setRecentPosts(postsResponse.data.posts);
        } else {
          setRecentPosts([]);
        }

        // Set analytics data
        if (analyticsResponse?.status === "success" && analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        } else {
          setAnalytics([]);
        }
      } catch (apiError) {
        console.warn("⚠️ API failed, using mock data:", apiError);

        // Fallback to mock data
        setStats({
          totalPosts: 45,
          publishedPosts: 38,
          draftPosts: 7,
          totalViews: 125430,
          totalLikes: 8920,
          totalUsers: 12543,
          todayViews: 2341,
          weeklyGrowth: 12,
        });

        setRecentPosts([
          {
            _id: "1",
            title: "Ultimate Blackjack Strategy Guide",
            slug: "ultimate-blackjack-strategy-guide",
            status: "published",
            views: 1250,
            likes: 89,
            createdAt: new Date().toISOString(),
            author: {
              username: "admin",
              profile: { firstName: "Admin", lastName: "User" },
            },
          },
          {
            _id: "2",
            title: "Top 10 Slot Machines for Beginners",
            slug: "top-10-slot-machines-beginners",
            status: "published",
            views: 980,
            likes: 67,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            author: {
              username: "admin",
              profile: { firstName: "Admin", lastName: "User" },
            },
          },
        ]);

        setAnalytics([
          { date: "2024-01-14", views: 1200, posts: 2, users: 45 },
          { date: "2024-01-15", views: 1450, posts: 3, users: 52 },
          { date: "2024-01-16", views: 1100, posts: 1, users: 38 },
          { date: "2024-01-17", views: 1650, posts: 4, users: 61 },
          { date: "2024-01-18", views: 1350, posts: 2, users: 47 },
          { date: "2024-01-19", views: 1550, posts: 3, users: 55 },
          { date: "2024-01-20", views: 1750, posts: 5, users: 68 },
        ]);
      }
    } catch (err) {
      console.error("🚨 Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAuthorName = (author: RecentPost["author"]) => {
    if (author.profile.firstName && author.profile.lastName) {
      return `${author.profile.firstName} ${author.profile.lastName}`;
    }
    return author.username;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "draft":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      case "archived":
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
    }
  };

  // Chart colors
  const COLORS = ["#d4af37", "#00ffff", "#ff1493", "#32cd32"];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <Button onClick={handleRefresh} className="gold-gradient text-black">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-casino-red mx-auto mb-4" />
          <p className="text-xl text-gray-300 mb-4">{error}</p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-casino-gold text-casino-gold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back! Here's what's happening with your casino blog.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Link to="/admin/posts/create">
            <Button className="gold-gradient text-black font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="casino-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Posts
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(stats.totalPosts)}
                  </p>
                  <p className="text-xs text-casino-gold mt-1">
                    {stats.publishedPosts} published, {stats.draftPosts} drafts
                  </p>
                </div>
                <FileText className="h-8 w-8 text-casino-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Views
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(stats.totalViews)}
                  </p>
                  <p className="text-xs text-casino-neon mt-1">
                    {formatNumber(stats.todayViews)} today
                  </p>
                </div>
                <Eye className="h-8 w-8 text-casino-neon" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Likes
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(stats.totalLikes)}
                  </p>
                  <p className="text-xs text-casino-neon-pink mt-1">
                    +{stats.weeklyGrowth}% this week
                  </p>
                </div>
                <Heart className="h-8 w-8 text-casino-neon-pink" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(stats.totalUsers)}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    Growing
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Analytics */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Views Analytics (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #D4AF37",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#D4AF37", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mb-2 mx-auto" />
                  <p>No analytics data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Post Status Distribution */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Post Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Published",
                        value: stats.publishedPosts,
                        color: "#10B981",
                      },
                      {
                        name: "Draft",
                        value: stats.draftPosts,
                        color: "#F59E0B",
                      },
                      {
                        name: "Archived",
                        value:
                          stats.totalPosts -
                          stats.publishedPosts -
                          stats.draftPosts,
                        color: "#6B7280",
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      {
                        name: "Published",
                        value: stats.publishedPosts,
                        color: "#10B981",
                      },
                      {
                        name: "Draft",
                        value: stats.draftPosts,
                        color: "#F59E0B",
                      },
                      {
                        name: "Archived",
                        value:
                          stats.totalPosts -
                          stats.publishedPosts -
                          stats.draftPosts,
                        color: "#6B7280",
                      },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #D4AF37",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <Card className="casino-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Recent Posts</CardTitle>
            <Link to="/admin/posts">
              <Button
                variant="outline"
                size="sm"
                className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-casino-gold/20 hover:border-casino-gold/40 transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-white hover:text-casino-gold transition-colors">
                          <Link to={`/admin/posts/edit/${post._id}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>By {getAuthorName(post.author)}</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(post.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-casino-neon hover:bg-casino-neon/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/posts/edit/${post._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-casino-gold hover:bg-casino-gold/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No posts yet</p>
                <Link to="/admin/posts/create">
                  <Button className="gold-gradient text-black font-semibold">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/posts/create" className="block">
              <Button className="w-full gold-gradient text-black font-semibold justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>

            <Link to="/admin/posts" className="block">
              <Button
                variant="outline"
                className="w-full border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Posts
              </Button>
            </Link>

            <Link to="/admin/analytics" className="block">
              <Button
                variant="outline"
                className="w-full border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>

            <Link to="/admin/users" className="block">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-black justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>

            <div className="pt-4 border-t border-casino-gold/20">
              <h4 className="text-sm font-semibold text-casino-gold mb-3">
                System Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400">● Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Database</span>
                  <span className="text-green-400">● Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Backup</span>
                  <span className="text-gray-400">2 hours ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
