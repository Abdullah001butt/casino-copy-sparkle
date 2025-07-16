import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "@/services/adminApi";
import { useToast } from "@/hooks/use-toast";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "draft" | "published" | "archived";
  author: {
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  views: number;
  likes: number;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
  publishedAt?: string;
}

interface PostsResponse {
  status: string;
  data: {
    posts: Post[];
  };
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
}

const AdminPosts: React.FC = () => {
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
  const { toast } = useToast();

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

      console.log("Fetching posts with params:", params);

      const response = await adminApi.getAllPosts(params);
      console.log("Posts response:", response);

      if (response.status === "success") {
        setPosts(response.data?.posts || []);
        setPagination(
          response.pagination || {
            page: 1,
            limit: 10,
            pages: 1,
            total: 0,
          }
        );
        setCurrentPage(page);
      } else {
        throw new Error(response.message || "Failed to fetch posts");
      }
    } catch (err: any) {
      console.error("Posts fetch error:", err);
      setError(err.message || "Failed to load posts. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
  }, [currentPage, searchQuery, statusFilter, categoryFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await adminApi.deletePost(postId);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete post",
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
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update post status",
        variant: "destructive",
      });
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAuthorName = (author: Post["author"]) => {
    if (author.profile?.firstName && author.profile?.lastName) {
      return `${author.profile.firstName} ${author.profile.lastName}`;
    }
    return author.username;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Posts</h1>
        </div>
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Posts</h1>
          <Link to="/admin/posts/create">
            <Button className="gold-gradient text-black font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-casino-red mx-auto mb-4" />
          <p className="text-xl text-gray-300 mb-4">{error}</p>
          <Button
            onClick={() =>
              fetchPosts(currentPage, searchQuery, statusFilter, categoryFilter)
            }
            variant="outline"
            className="border-casino-gold text-casino-gold"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-white">Posts</h1>
          <p className="text-gray-400 mt-1">
            Manage your blog posts and content
          </p>
        </div>
        <Link to="/admin/posts/create">
          <Button className="gold-gradient text-black font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="casino-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 bg-gray-800 border-casino-gold/30 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-casino-gold/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-casino-gold/30">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-casino-gold/30 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-casino-gold/30">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card className="casino-card">
        <CardHeader>
          <CardTitle className="text-white">
            Posts ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-casino-gold/20 hover:border-casino-gold/40 transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white hover:text-casino-gold transition-colors">
                        <Link to={`/admin/posts/edit/${post._id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <Badge
                        className={`${getStatusColor(post.status)} border`}
                      >
                        {post.status}
                      </Badge>
                      {post.isFeatured && (
                        <Badge className="bg-casino-gold/20 text-casino-gold border-casino-gold/30">
                          Featured
                        </Badge>
                      )}
                      {post.isTrending && (
                        <Badge className="bg-casino-neon/20 text-casino-neon border-casino-neon/30">
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {getAuthorName(post.author)}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.views} views</span>
                      <span>{post.likes} likes</span>
                      <span className="capitalize">
                        {post.category.replace("-", " ")}
                      </span>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:bg-gray-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-800 border-casino-gold/20"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(post._id, post.status)
                          }
                          className="text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          {post.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-600 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "No posts match your current filters."
                  : "Get started by creating your first blog post."}
              </p>
              {!searchQuery &&
                statusFilter === "all" &&
                categoryFilter === "all" && (
                  <Link to="/admin/posts/create">
                    <Button className="gold-gradient text-black font-semibold">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Post
                    </Button>
                  </Link>
                )}
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
                Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
                {pagination.total} posts
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="border-casino-gold/30 text-casino-gold hover:bg-casino-gold/20"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className={
                            currentPage === pageNum
                              ? "gold-gradient text-black"
                              : "border-casino-gold/30 text-casino-gold hover:bg-casino-gold/20"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.pages || loading}
                  className="border-casino-gold/30 text-casino-gold hover:bg-casino-gold/20"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading overlay */}
      {loading && posts.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-casino-gold/20">
            <Loader2 className="h-8 w-8 animate-spin text-casino-gold mx-auto mb-4" />
            <p className="text-white">Loading posts...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
