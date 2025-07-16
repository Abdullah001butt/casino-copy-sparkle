import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Crown,
  Loader2,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import adminApi from "@/services/adminApi";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: string;
  lastLogin?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  vipUsers: number;
  newUsersToday: number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page = 1, search = "", status = "") => {
    try {
      setLoading(page === 1);
      setError(null);

      const params = {
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(status && { status }),
        sort: "-createdAt",
      };

      console.log("🔄 Fetching users with params:", params);

      // Try real API first, fallback to mock data
      try {
        const response = await adminApi.getUsers(params);

        if (response.status === "success") {
          setUsers(response.data.users);
          setCurrentPage(response.currentPage);
          setTotalPages(response.totalPages);
          setTotalResults(response.totalResults);
        } else {
          throw new Error("API response not successful");
        }
      } catch (apiError) {
        console.warn("⚠️ Users API failed, using mock data:", apiError);

        // Mock data fallback
        const mockUsers: User[] = [
          {
            _id: "1",
            username: "john_doe",
            email: "john@example.com",
            role: "player",
            status: "active",
            createdAt: "2024-01-15T10:30:00Z",
            lastLogin: "2024-01-20T14:22:00Z",
            profile: { firstName: "John", lastName: "Doe" },
          },
          {
            _id: "2",
            username: "jane_smith",
            email: "jane@example.com",
            role: "vip",
            status: "active",
            createdAt: "2024-01-10T09:15:00Z",
            lastLogin: "2024-01-19T16:45:00Z",
            profile: { firstName: "Jane", lastName: "Smith" },
          },
          {
            _id: "3",
            username: "mike_wilson",
            email: "mike@example.com",
            role: "player",
            status: "banned",
            createdAt: "2024-01-05T11:20:00Z",
            lastLogin: "2024-01-18T12:30:00Z",
            profile: { firstName: "Mike", lastName: "Wilson" },
          },
          {
            _id: "4",
            username: "sarah_jones",
            email: "sarah@example.com",
            role: "player",
            status: "inactive",
            createdAt: "2023-12-20T08:45:00Z",
            lastLogin: "2024-01-15T10:15:00Z",
            profile: { firstName: "Sarah", lastName: "Jones" },
          },
          {
            _id: "5",
            username: "admin_user",
            email: "admin@casino.com",
            role: "admin",
            status: "active",
            createdAt: "2023-12-01T00:00:00Z",
            lastLogin: "2024-01-20T18:30:00Z",
            profile: { firstName: "Admin", lastName: "User" },
          },
        ];

        // Filter mock data based on search and status
        let filteredUsers = mockUsers;

        if (search) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.username.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase()) ||
              (user.profile?.firstName &&
                user.profile.firstName
                  .toLowerCase()
                  .includes(search.toLowerCase())) ||
              (user.profile?.lastName &&
                user.profile.lastName
                  .toLowerCase()
                  .includes(search.toLowerCase()))
          );
        }

        if (status) {
          filteredUsers = filteredUsers.filter(
            (user) => user.status === status
          );
        }

        setUsers(filteredUsers);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalResults(filteredUsers.length);
      }
    } catch (error) {
      console.error("🚨 Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Try real API first, fallback to mock data
      try {
        const response = await adminApi.getUserStats();
        if (response.status === "success") {
          setStats(response.data);
        } else {
          throw new Error("Stats API failed");
        }
      } catch (apiError) {
        console.warn("⚠️ User stats API failed, using mock data:", apiError);

        // Mock stats
        setStats({
          totalUsers: 12543,
          activeUsers: 8920,
          inactiveUsers: 2341,
          bannedUsers: 156,
          vipUsers: 1126,
          newUsersToday: 23,
        });
      }
    } catch (error) {
      console.error("🚨 Failed to fetch user stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchUsers(1, searchTerm, statusFilter);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers(currentPage, searchTerm, statusFilter);
    fetchUserStats();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm, statusFilter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600/20 text-green-400 border-green-600/30";
      case "inactive":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
      case "banned":
        return "bg-red-600/20 text-red-400 border-red-600/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-casino-gold/20 text-casino-gold border-casino-gold/30";
      case "moderator":
        return "bg-casino-neon/20 text-casino-neon border-casino-neon/30";
      case "vip":
        return "bg-casino-neon-pink/20 text-casino-neon-pink border-casino-neon-pink/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600/30";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = (user: User) => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.username;
  };

  const getUserInitials = (user: User) => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`;
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
        </div>
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor user accounts</p>
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
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-casino-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Inactive</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.inactiveUsers.toLocaleString()}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Banned</p>
                  <p className="text-2xl font-bold text-red-400">
                    {stats.bannedUsers.toLocaleString()}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">VIP Users</p>
                  <p className="text-2xl font-bold text-casino-neon-pink">
                    {stats.vipUsers.toLocaleString()}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-casino-neon-pink" />
              </div>
            </CardContent>
          </Card>

          <Card className="casino-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">New Today</p>
                  <p className="text-2xl font-bold text-casino-neon">
                    {stats.newUsersToday}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-casino-neon" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="casino-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="casino-card border-red-600/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">
            Users ({totalResults.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Joined</TableHead>
                      <TableHead className="text-gray-300">
                        Last Login
                      </TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-casino-gold/20 rounded-full flex items-center justify-center">
                              <span className="text-casino-gold font-semibold text-sm">
                                {getUserInitials(user)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {getUserName(user)}
                              </p>
                              <p className="text-sm text-gray-400">
                                @{user.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getRoleColor(user.role)} border`}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(user.status)} border`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-casino-neon hover:bg-casino-neon/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-casino-gold hover:bg-casino-gold/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-400/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * 10 + 1} to{" "}
                    {Math.min(currentPage * 10, totalResults)} of {totalResults}{" "}
                    users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={
                                currentPage === page
                                  ? "gold-gradient text-black"
                                  : "border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                              }
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Users Found
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || statusFilter
                  ? "No users match your current filters."
                  : "No users have been registered yet."}
              </p>
              {(searchTerm || statusFilter) && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  }}
                  variant="outline"
                  className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Actions Modal/Dialog would go here */}
      {/* You can add modals for user details, edit, ban/unban, etc. */}
    </div>
  );
};

export default AdminUsers;
