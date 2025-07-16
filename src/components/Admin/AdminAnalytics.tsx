import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  GamepadIcon,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  totalBets: number;
  totalWins: number;
  conversionRate: number;
  averageSessionTime: number;
  revenueGrowth: number;
  userGrowth: number;
  popularGames: Array<{
    name: string;
    plays: number;
    revenue: number;
  }>;
  dailyStats: Array<{
    date: string;
    revenue: number;
    users: number;
    bets: number;
  }>;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalGames: 0,
    totalBets: 0,
    totalWins: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    popularGames: [],
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with real API call
      const mockData: AnalyticsData = {
        totalRevenue: 1250000,
        totalUsers: 15420,
        activeUsers: 3240,
        totalGames: 450,
        totalBets: 89340,
        totalWins: 67230,
        conversionRate: 24.5,
        averageSessionTime: 45,
        revenueGrowth: 12.5,
        userGrowth: 8.3,
        popularGames: [
          { name: "Mega Fortune Dreams", plays: 15420, revenue: 245000 },
          { name: "Lightning Blackjack", plays: 12340, revenue: 189000 },
          { name: "Book of Dead", plays: 11230, revenue: 156000 },
          { name: "Starburst", plays: 9870, revenue: 134000 },
          { name: "Gonzo's Quest", plays: 8760, revenue: 123000 },
        ],
        dailyStats: [
          { date: "2024-01-14", revenue: 45000, users: 234, bets: 1240 },
          { date: "2024-01-15", revenue: 52000, users: 267, bets: 1456 },
          { date: "2024-01-16", revenue: 48000, users: 245, bets: 1334 },
          { date: "2024-01-17", revenue: 61000, users: 289, bets: 1567 },
          { date: "2024-01-18", revenue: 55000, users: 278, bets: 1445 },
          { date: "2024-01-19", revenue: 58000, users: 295, bets: 1523 },
          { date: "2024-01-20", revenue: 63000, users: 312, bets: 1634 },
        ],
      };

      setAnalytics(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUp className="h-4 w-4 text-green-400" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-400" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-400" : "text-red-400";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-casino-gold">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-casino-gold" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Monitor your casino's performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-casino-gold/30 rounded-md text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button
            variant="outline"
            onClick={fetchAnalytics}
            className="border-casino-gold/30 text-casino-gold hover:bg-casino-gold hover:text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="gold-gradient text-black font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="casino-card hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
                <div
                  className={`flex items-center mt-2 ${getGrowthColor(
                    analytics.revenueGrowth
                  )}`}
                >
                  {getGrowthIcon(analytics.revenueGrowth)}
                  <span className="text-sm ml-1">
                    {Math.abs(analytics.revenueGrowth)}% vs last period
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-casino-gold/20">
                <DollarSign className="h-6 w-6 text-casino-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatNumber(analytics.totalUsers)}
                </p>
                <div
                  className={`flex items-center mt-2 ${getGrowthColor(
                    analytics.userGrowth
                  )}`}
                >
                  {getGrowthIcon(analytics.userGrowth)}
                  <span className="text-sm ml-1">
                    {Math.abs(analytics.userGrowth)}% vs last period
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-casino-neon/20">
                <Users className="h-6 w-6 text-casino-neon" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatNumber(analytics.activeUsers)}
                </p>
                <div className="flex items-center mt-2 text-casino-neon-pink">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm ml-1">
                    {(
                      (analytics.activeUsers / analytics.totalUsers) *
                      100
                    ).toFixed(1)}
                    % of total
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-casino-neon-pink/20">
                <Activity className="h-6 w-6 text-casino-neon-pink" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="casino-card hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Bets</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatNumber(analytics.totalBets)}
                </p>
                <div className="flex items-center mt-2 text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm ml-1">
                    {analytics.conversionRate}% conversion
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-400/20">
                <GamepadIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-casino-gold" />
              Daily Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.dailyStats.map((stat, index) => {
                const maxRevenue = Math.max(
                  ...analytics.dailyStats.map((s) => s.revenue)
                );
                const height = (stat.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-gray-400 mb-2">
                      {formatCurrency(stat.revenue)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-casino-gold to-casino-neon rounded-t-sm transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(stat.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-casino-neon" />
              Daily Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.dailyStats.map((stat, index) => {
                const maxUsers = Math.max(
                  ...analytics.dailyStats.map((s) => s.users)
                );
                const height = (stat.users / maxUsers) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-gray-400 mb-2">
                      {stat.users}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-casino-neon to-casino-neon-pink rounded-t-sm transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(stat.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Games and Additional Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Popular Games */}
        <div className="lg:col-span-2">
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GamepadIcon className="h-5 w-5 text-casino-gold" />
                Top Performing Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularGames.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-casino-gold rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{game.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatNumber(game.plays)} plays
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-casino-neon font-semibold">
                        {formatCurrency(game.revenue)}
                      </p>
                      <div className="w-24 bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-casino-neon h-2 rounded-full"
                          style={{
                            width: `${
                              (game.revenue /
                                analytics.popularGames[0].revenue) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Performance Indicators */}
        <Card className="casino-card">
          <CardHeader>
            <CardTitle className="text-white">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="text-casino-gold font-semibold">
                  {analytics.conversionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-casino-gold h-2 rounded-full"
                  style={{ width: `${analytics.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Avg Session Time</span>
                <span className="text-casino-neon font-semibold">
                  {formatTime(analytics.averageSessionTime)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-casino-neon h-2 rounded-full"
                  style={{
                    width: `${(analytics.averageSessionTime / 120) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-casino-neon-pink font-semibold">
                  {((analytics.totalWins / analytics.totalBets) * 100).toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-casino-neon-pink h-2 rounded-full"
                  style={{
                    width: `${
                      (analytics.totalWins / analytics.totalBets) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-white font-semibold mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Games</span>
                  <span className="text-white">{analytics.totalGames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Wins</span>
                  <span className="text-green-400">
                    {formatNumber(analytics.totalWins)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">House Edge</span>
                  <span className="text-casino-gold">2.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-casino-neon animate-pulse" />
            Real-time Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-casino-gold mb-2">
                {analytics.activeUsers}
              </div>
              <div className="text-gray-400 text-sm">Players Online</div>
              <div className="flex items-center justify-center mt-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Live
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-casino-neon mb-2">
                {Math.floor(analytics.totalBets / 7)}
              </div>
              <div className="text-gray-400 text-sm">Bets Today</div>
              <div className="text-casino-neon text-sm mt-2">
                +{Math.floor(Math.random() * 50)} in last hour
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-casino-neon-pink mb-2">
                {formatCurrency(Math.floor(analytics.totalRevenue / 30))}
              </div>
              <div className="text-gray-400 text-sm">Revenue Today</div>
              <div className="text-green-400 text-sm mt-2">
                +12% vs yesterday
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {Math.floor(analytics.totalWins / 7)}
              </div>
              <div className="text-gray-400 text-sm">Wins Today</div>
              <div className="text-casino-gold text-sm mt-2">
                {(
                  (Math.floor(analytics.totalWins / 7) /
                    Math.floor(analytics.totalBets / 7)) *
                  100
                ).toFixed(1)}
                % win rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="border-casino-neon-pink text-casino-neon-pink hover:bg-casino-neon-pink hover:text-black"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              <Eye className="w-4 h-4 mr-2" />
              Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
