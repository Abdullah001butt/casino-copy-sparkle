import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import blogApi from "@/services/blogApi";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage?: {
    url: string;
    alt: string;
  };
  author: {
    username: string;
    profile: {
      firstName?: string;
      lastName?: string;
    };
  };
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  isFeatured: boolean;
  isTrending: boolean;
}

interface SearchFilters {
  search: string;
  category: string;
  sortBy: string;
}

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    pages: 1,
    total: 0,
  });

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    sortBy: searchParams.get("sort") || "-publishedAt",
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const [activeTab, setActiveTab] = useState(filters.category);

  const categories = [
    { value: "all", label: "All Categories", icon: "📚" },
    { value: "strategies", label: "Strategies", icon: "🎯" },
    { value: "game-guides", label: "Game Guides", icon: "🎮" },
    { value: "news", label: "News", icon: "📰" },
    { value: "tips-tricks", label: "Tips & Tricks", icon: "💡" },
    { value: "reviews", label: "Reviews", icon: "⭐" },
    { value: "promotions", label: "Promotions", icon: "🎁" },
    { value: "winner-stories", label: "Winner Stories", icon: "🏆" },
    { value: "responsible-gambling", label: "Responsible Gaming", icon: "🛡️" },
  ];

  const sortOptions = [
    { value: "-publishedAt", label: "Latest First" },
    { value: "publishedAt", label: "Oldest First" },
    { value: "-views", label: "Most Popular" },
    { value: "-likes", label: "Most Liked" },
    { value: "title", label: "A-Z" },
    { value: "-title", label: "Z-A" },
  ];

  useEffect(() => {
    fetchBlogs(1, filters);
  }, []);

  useEffect(() => {
    setActiveTab(filters.category);
  }, [filters.category]);

  const fetchBlogs = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Build API parameters
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "9",
        sort: currentFilters.sortBy,
      };

      // Add filters to params
      if (currentFilters.category !== "all")
        params.category = currentFilters.category;
      if (currentFilters.search.trim())
        params.search = currentFilters.search.trim();

      console.log("🔍 Fetching blogs with params:", params);

      const response = await blogApi.getAllBlogs(params);

      if (response.status === "success") {
        setBlogs(response.data.blogs || []);

        // Update pagination
        setPagination({
          page: response.currentPage || page,
          limit: 9,
          pages: response.totalPages || 1,
          total: response.totalResults || 0,
        });

        // Update URL parameters
        updateURLParams(currentFilters, page);
      } else {
        setError("Failed to load blog posts");
      }
    } catch (err: any) {
      console.error("❌ Error fetching blogs:", err);
      setError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const updateURLParams = (currentFilters: SearchFilters, page: number) => {
    const params = new URLSearchParams();

    if (currentFilters.search) params.set("search", currentFilters.search);
    if (currentFilters.category !== "all")
      params.set("category", currentFilters.category);
    if (currentFilters.sortBy !== "-publishedAt")
      params.set("sort", currentFilters.sortBy);
    if (page > 1) params.set("page", page.toString());

    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    fetchBlogs(1, newFilters);
  };

  const handleTabChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    setActiveTab(category);
    fetchBlogs(1, newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchBlogs(1, newFilters);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchBlogs(newPage, filters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData?.icon || "📚";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      strategies: "bg-casino-gold/20 text-casino-gold border-casino-gold/30",
      "game-guides": "bg-casino-neon/20 text-casino-neon border-casino-neon/30",
      news: "bg-casino-neon-pink/20 text-casino-neon-pink border-casino-neon-pink/30",
      "tips-tricks": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      reviews: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      promotions: "bg-green-500/20 text-green-400 border-green-500/30",
      "winner-stories": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "responsible-gambling": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return (
      colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    );
  };

  const getAuthorName = (author: BlogPost["author"]) => {
    if (author.profile.firstName && author.profile.lastName) {
      return `${author.profile.firstName} ${author.profile.lastName}`;
    }
    return author.username;
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-casino-gold" />
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-white">Casino </span>
                <span className="gold-gradient bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Expert insights, winning strategies, and the latest casino news
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="mb-8">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-casino-gold/20">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-casino-gold"
                    />
                  </div>
                </form>

                {/* Sort Filter */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-casino-gold focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Display */}
              {(filters.search || filters.category !== "all") && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge className="bg-casino-gold/20 text-casino-gold border-casino-gold/30">
                      Search: "{filters.search}"
                      <button
                        onClick={() => {
                          setSearchInput("");
                          handleFilterChange("search", "");
                        }}
                        className="ml-2 hover:text-casino-gold/70"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.category !== "all" && (
                    <Badge className="bg-casino-neon/20 text-casino-neon border-casino-neon/30">
                      Category:{" "}
                      {
                        categories.find((c) => c.value === filters.category)
                          ?.label
                      }
                      <button
                        onClick={() => handleTabChange("all")}
                        className="ml-2 hover:text-casino-neon/70"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 bg-gray-900/50 border border-casino-gold/20 rounded-lg p-1 h-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="flex flex-col items-center space-y-1 py-3 px-2 text-xs data-[state=active]:bg-casino-gold data-[state=active]:text-black text-gray-400 hover:text-casino-gold transition-colors"
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="hidden sm:block text-center leading-tight">
                      {category.label}
                    </span>
                    <span className="sm:hidden">
                      {category.label.split(" ")[0]}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent
                  key={category.value}
                  value={category.value}
                  className="mt-8"
                >
                  {/* Results Count */}
                  {!loading && (
                    <div className="mb-6">
                      <p className="text-gray-400">
                        {pagination.total > 0
                          ? `Showing ${
                              (pagination.page - 1) * pagination.limit + 1
                            }-${Math.min(
                              pagination.page * pagination.limit,
                              pagination.total
                            )} of ${pagination.total} ${
                              category.value === "all"
                                ? "articles"
                                : category.label.toLowerCase()
                            }`
                          : `No ${
                              category.value === "all"
                                ? "articles"
                                : category.label.toLowerCase()
                            } found`}
                      </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading && (
                    <div className="flex items-center justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
                        <p className="text-xl text-gray-300">
                          Loading articles...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !loading && (
                    <div className="text-center py-16">
                      <AlertCircle className="h-12 w-12 text-casino-red mx-auto mb-4" />
                      <p className="text-xl text-gray-300 mb-4">{error}</p>
                      <Button
                        onClick={() => fetchBlogs(pagination.page, filters)}
                        className="gold-gradient text-black font-semibold"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {/* No Results */}
                  {!loading && !error && blogs.length === 0 && (
                    <div className="text-center py-16">
                      <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-xl text-gray-300 mb-4">
                        No{" "}
                        {category.value === "all"
                          ? "articles"
                          : category.label.toLowerCase()}{" "}
                        found
                      </p>
                      <p className="text-gray-400 mb-6">
                        {filters.search || filters.category !== "all"
                          ? "Try adjusting your search terms or filters."
                          : "Check back soon for new content!"}
                      </p>
                      {(filters.search || filters.category !== "all") && (
                        <Button
                          onClick={() => {
                            setFilters({
                              search: "",
                              category: "all",
                              sortBy: "-publishedAt",
                            });
                            setSearchInput("");
                            setActiveTab("all");
                            fetchBlogs(1, {
                              search: "",
                              category: "all",
                              sortBy: "-publishedAt",
                            });
                          }}
                          variant="outline"
                          className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Blog Posts Grid */}
                  {!loading && !error && blogs.length > 0 && (
                    <>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {blogs.map((blog) => (
                          <Card
                            key={blog._id}
                            className="casino-card group hover:scale-105 transition-all duration-300 overflow-hidden"
                          >
                            <CardHeader className="p-0">
                              {/* Featured Image or Placeholder */}
                              <div className="relative h-48 bg-gradient-to-br from-casino-purple/30 to-casino-red/30 overflow-hidden">
                                {blog.featuredImage?.url ? (
                                  <img
                                    src={blog.featuredImage.url}
                                    alt={blog.featuredImage.alt || blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-6xl">
                                      {getCategoryIcon(blog.category)}
                                    </div>
                                  </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                  <Badge
                                    className={`${getCategoryColor(
                                      blog.category
                                    )} border`}
                                  >
                                    {getCategoryIcon(blog.category)}{" "}
                                    {blog.category.replace("-", " ")}
                                  </Badge>
                                </div>

                                {/* Trending/Featured Badges */}
                                <div className="absolute top-3 right-3 flex flex-col space-y-1">
                                  {blog.isFeatured && (
                                    <Badge className="bg-casino-gold/20 text-casino-gold border-casino-gold/30">
                                      ⭐ Featured
                                    </Badge>
                                  )}
                                  {blog.isTrending && (
                                    <Badge className="bg-casino-red/20 text-casino-red border-casino-red/30">
                                      🔥 Trending
                                    </Badge>
                                  )}
                                </div>

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 gold-gradient text-black font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                    asChild
                                  >
                                    <Link to={`/blog/${blog.slug}`}>
                                      Read Article
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="p-6">
                              {/* Article Title */}
                              <h3 className="font-bold text-white text-xl mb-3 leading-tight group-hover:text-casino-gold transition-colors">
                                <Link to={`/blog/${blog.slug}`}>
                                  {blog.title}
                                </Link>
                              </h3>

                              {/* Article Excerpt */}
                              <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                                {blog.excerpt}
                              </p>

                              {/* Tags */}
                              {blog.tags && blog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {blog.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs border-casino-neon/30 text-casino-neon"
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                  {blog.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs border-gray-500/30 text-gray-400"
                                    >
                                      +{blog.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Article Meta */}
                              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {blog.readingTime || 5} min read
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{blog.views || 0}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{blog.likes || 0}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Author and Date */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-casino-gold/20 rounded-full flex items-center justify-center">
                                    <span className="text-casino-gold font-semibold text-xs">
                                      {getAuthorName(blog.author)
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {getAuthorName(blog.author)}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {blogApi.formatDate(blog.publishedAt)}
                                    </p>
                                  </div>
                                </div>

                                <Link
                                  to={`/blog/${blog.slug}`}
                                  className="text-casino-gold hover:text-casino-gold/80 transition-colors"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Pagination */}
                      {pagination.pages > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(pagination.page - 1)
                            }
                            disabled={pagination.page <= 1}
                            className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
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
                                } else if (
                                  pagination.page >=
                                  pagination.pages - 2
                                ) {
                                  pageNum = pagination.pages - 4 + i;
                                } else {
                                  pageNum = pagination.page - 2 + i;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      pagination.page === pageNum
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
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
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(pagination.page + 1)
                            }
                            disabled={pagination.page >= pagination.pages}
                            className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Category Quick Stats */}
          <div className="mt-16 mb-8">
            <Card className="casino-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Explore by Category
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleTabChange(category.value)}
                      className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        activeTab === category.value
                          ? "bg-casino-gold/20 border-casino-gold/50"
                          : "bg-gray-800/50 border-gray-700 hover:border-casino-gold/30"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <p className="text-sm font-medium text-white mb-1">
                          {category.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {/* You can add post counts here if available */}
                          Browse articles
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
