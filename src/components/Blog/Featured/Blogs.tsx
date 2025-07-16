import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
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

const FeaturedBlogs: React.FC = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Fetching featured blogs...");
      const response = await blogApi.getFeaturedBlogs(6);

      if (response.status === "success") {
        setFeaturedBlogs(response.data.blogs || []);
        console.log(
          "✅ Featured blogs loaded:",
          response.data.blogs?.length || 0
        );
      } else {
        setError("Failed to load featured blogs");
      }
    } catch (err: any) {
      console.error("❌ Error fetching featured blogs:", err);
      setError(err.message || "Failed to load featured blogs");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      strategies: "🎯",
      "game-guides": "🎮",
      news: "📰",
      "tips-tricks": "💡",
      reviews: "⭐",
      promotions: "🎁",
      "winner-stories": "🏆",
      "responsible-gambling": "🛡️",
    };
    return icons[category] || "📚";
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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-black/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-casino-gold" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Featured </span>
                <span className="gold-gradient bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover expert insights, winning strategies, and the latest
              casino news
            </p>
          </div>

          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
              <p className="text-xl text-gray-300">
                Loading featured articles...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-black/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-casino-gold" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Featured </span>
                <span className="gold-gradient bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
            </div>
          </div>

          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-casino-red mx-auto mb-4" />
            <p className="text-xl text-gray-300 mb-4">{error}</p>
            <Button
              onClick={fetchFeaturedBlogs}
              className="gold-gradient text-black font-semibold"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (featuredBlogs.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-black/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-casino-gold" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Featured </span>
                <span className="gold-gradient bg-clip-text text-transparent">
                  Articles
                </span>
              </h2>
            </div>
          </div>

          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-300 mb-4">
              No featured articles available yet
            </p>
            <p className="text-gray-400">
              Check back soon for expert casino insights!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black/50 to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-casino-gold" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Featured </span>
              <span className="gold-gradient bg-clip-text text-transparent">
                Articles
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover expert insights, winning strategies, and the latest casino
            news
          </p>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredBlogs.map((blog) => (
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
                      className={`${getCategoryColor(blog.category)} border`}
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
                      <Link to={`/blog/${blog.slug}`}>Read Article</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Article Title */}
                <h3 className="font-bold text-white text-xl mb-3 leading-tight group-hover:text-casino-gold transition-colors">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
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
                      <span>{blog.readingTime || 5} min read</span>
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
                        {getAuthorName(blog.author).charAt(0).toUpperCase()}
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

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="gold-gradient text-black font-bold text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to="/blog">📚 View All Articles</Link>
          </Button>
          <p className="text-gray-400 mt-4">
            New articles published weekly • Expert insights • Winning strategies
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
