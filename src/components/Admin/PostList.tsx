import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApi from "@/services/adminApi";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[];
  author: {
    username: string;
    profile: {
      firstName?: string;
      lastName?: string;
    };
  };
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isFeatured: boolean;
  isTrending: boolean;
}

interface PostsResponse {
  status: string;
  results: number;
  totalResults: number;
  totalPages: number;
  currentPage: number;
  data: {
    blogs: Post[];
  };
}

const PostList: React.FC = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1,
    total: 0,
  });
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "strategies", label: "Strategies" },
    { value: "game-guides", label: "Game Guides" },
    { value: "tips-tricks", label: "Tips & Tricks" },
    { value: "news", label: "News" },
    { value: "reviews", label: "Reviews" },
    { value: "promotions", label: "Promotions" },
    { value: "winner-stories", label: "Winner Stories" },
    { value: "responsible-gambling", label: "Responsible Gaming" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  // Fetch posts
  const fetchPosts = async (
    page = 1,
    search = "",
    status = "all",
    category = "all"
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        page: page.toString(),
        limit: "10",
        sort: "-createdAt",
      };

      if (search.trim()) params.search = search.trim();
      if (status !== "all") params.status = status;
      if (category !== "all") params.category = category;

      const response: PostsResponse = await adminApi.getAllPosts(params);

      setPosts(response.data.blogs);
      setPagination({
        page: response.currentPage,
        limit: 10,
        pages: response.totalPages,
        total: response.totalResults,
      });
      setCurrentPage(page);
    } catch (err) {
      console.error("Posts fetch error:", err);
      setError("Failed to load posts. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(1, searchQuery, statusFilter, categoryFilter);
  }, []);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPosts(1, searchQuery, statusFilter, categoryFilter);
  };

  // Handle filter changes
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchPosts(1, searchQuery, status, categoryFilter);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    fetchPosts(1, searchQuery, statusFilter, category);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchPosts(page, searchQuery, statusFilter, categoryFilter);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
  };

  // Handle post selection
  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((post) => post._id));
    }
  };

  // Handle single post actions
  const handleDeletePost = async (postId: string) => {
    try {
      await adminApi.deletePost(postId);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      if (newStatus === "published") {
        await adminApi.publishPost(postId);
      } else {
        await adminApi.unpublishPost(postId);
      }

      toast({
        title: "Success",
        description: `Post ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully`,
      });
      fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
    } catch (error) {
      console.error("Status toggle error:", error);
      toast({
        title: "Error",
        description: "Failed to update post status",
        variant: "destructive",
      });
    }
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;

    try {
      setBulkLoading(true);
      await adminApi.bulkDeletePosts(selectedPosts);
      toast({
        title: "Success",
        description: `${selectedPosts.length} posts deleted successfully`,
      });
      setSelectedPosts([]);
      fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete posts",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedPosts.length === 0) return;

    try {
      setBulkLoading(true);
      await adminApi.bulkUpdatePosts(selectedPosts, { status });
      toast({
        title: "Success",
        description: `${selectedPosts.length} posts updated successfully`,
      });
      setSelectedPosts([]);
      fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
    } catch (error) {
      console.error("Bulk update error:", error);
      toast({
        title: "Error",
        description: "Failed to update posts",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  // Utility functions
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthorName = (author: Post["author"]) => {
    if (author.profile.firstName && author.profile.lastName) {
      return `${author.profile.firstName} ${author.profile.lastName}`;
    }
    return author.username;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
        </div>
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
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
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-1">
            Manage your blog posts and content
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

      {/* Filters and Search */}
      <Card className="casino-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-casino-neon text-black hover:bg-casino-neon/80"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <Card className="casino-card border-casino-gold/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">
                  {selectedPosts.length} post
                  {selectedPosts.length !== 1 ? "s" : ""} selected
                </span>
                <Button
                  onClick={() => setSelectedPosts([])}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleBulkStatusUpdate("published")}
                  disabled={bulkLoading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Publish
                </Button>
                <Button
                  onClick={() => handleBulkStatusUpdate("draft")}
                  disabled={bulkLoading}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Draft
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={bulkLoading}
                      size="sm"
                      variant="destructive"
                    >
                      {bulkLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Delete {selectedPosts.length} post
                        {selectedPosts.length !== 1 ? "s" : ""}?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. The selected posts will be
                        permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white border-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Table */}
      <Card className="casino-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              Posts ({pagination.total})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedPosts.length === posts.length && posts.length > 0
                }
                onCheckedChange={handleSelectAll}
                className="border-casino-gold"
              />
              <span className="text-sm text-gray-400">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first blog post to get started"}
              </p>
              <Link to="/admin/posts/create">
                <Button className="gold-gradient text-black font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-casino-gold/20 hover:border-casino-gold/40 transition-all duration-200"
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedPosts.includes(post._id)}
                    onCheckedChange={() => handleSelectPost(post._id)}
                    className="border-casino-gold"
                  />

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg leading-tight hover:text-casino-gold transition-colors">
                          <Link to={`/admin/posts/edit/${post._id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge
                          className={`text-xs font-medium border ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </Badge>
                        {post.isFeatured && (
                          <Badge className="bg-casino-gold/20 text-casino-gold border-casino-gold/30 text-xs">
                            Featured
                          </Badge>
                        )}
                        {post.isTrending && (
                          <Badge className="bg-casino-neon/20 text-casino-neon border-casino-neon/30 text-xs">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>By {getAuthorName(post.author)}</span>
                        <span>•</span>
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        {post.publishedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Published {formatDate(post.publishedAt)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(post.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs text-gray-400 border-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-400 border-gray-600"
                          >
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(post._id, post.status)
                          }
                          className="text-white hover:bg-gray-700"
                        >
                          {post.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/blog/${post.slug}`
                            )
                          }
                          className="text-white hover:bg-gray-700"
                        >
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSelectPost(post._id)}
                          className="text-white hover:bg-gray-700"
                        >
                          {selectedPosts.includes(post._id)
                            ? "Deselect"
                            : "Select"}
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Delete "{post.title}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                This action cannot be undone. This post will be
                                permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-800 text-white border-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="casino-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} posts
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  variant="outline"
                  size="sm"
                  className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          variant={
                            pagination.page === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          className={
                            pagination.page === pageNum
                              ? "gold-gradient text-black"
                              : "border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages || loading}
                  variant="outline"
                  size="sm"
                  className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostList;
