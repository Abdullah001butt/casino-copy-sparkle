import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  Share2,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  ThumbsUp,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import blogApi from "@/services/blogApi";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage?: {
    url: string;
    alt: string;
    caption?: string;
  };
  author: {
    username: string;
    profile: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  shares: number;
  isFeatured: boolean;
  isTrending: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const formatImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const fetchBlogPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📖 Fetching blog post:", postSlug);
      const response = await blogApi.getBlogBySlug(postSlug);

      if (response.status === "success") {
        const blogData = response.data.blog;
        
        // Format image URLs
        if (blogData.featuredImage?.url) {
          blogData.featuredImage.url = formatImageUrl(blogData.featuredImage.url);
        }
        
        setBlog(blogData);
        
        // Fetch related posts
        if (blogData._id) {
          fetchRelatedPosts(blogData._id);
        }
      } else {
        setError("Blog post not found");
      }
    } catch (err: any) {
      console.error("❌ Blog post fetch error:", err);
      if (err.message.includes("404")) {
        setError("Blog post not found");
      } else {
        setError(err.message || "Failed to load blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPostId: string) => {
    try {
      console.log("🔗 Fetching related posts for:", currentPostId);
      const response = await blogApi.getRelatedBlogs(currentPostId, 3);

      if (response.status === "success") {
        setRelatedPosts(response.data.blogs || []);
      }
    } catch (err) {
      console.error("❌ Related posts fetch error:", err);
    }
  };

  const handleLike = async () => {
    if (!blog || actionLoading) return;

    try {
      setActionLoading("like");
      await blogApi.likeBlog(blog._id);
      setLiked(!liked);

      // Update local state
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              likes: liked ? prev.likes - 1 : prev.likes + 1,
            }
          : null
      );
    } catch (err) {
      console.error("❌ Like error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleShare = async () => {
    if (!blog || actionLoading) return;

    try {
      setActionLoading("share");

      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      }

      // Update share count
      await blogApi.shareBlog(blog._id);
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              shares: prev.shares + 1,
            }
          : null
      );
    } catch (err) {
      console.error("❌ Share error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Implement bookmark API call
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
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
                <p className="text-xl text-gray-300">Loading article...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-casino-red mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Article Not Found
              </h1>
              <p className="text-xl text-gray-300 mb-6">{error}</p>
              <div className="space-x-4">
                <Button
                  onClick={() => navigate("/blog")}
                  className="gold-gradient text-black font-semibold"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <Link to="/" className="hover:text-casino-gold transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/blog"
                className="hover:text-casino-gold transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="text-white">{blog.title}</span>
            </nav>
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="casino-card p-8">
                {/* Article Header */}
                <header className="mb-8">
                  {/* Category and Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge
                      className={`${getCategoryColor(blog.category)} border`}
                    >
                      {getCategoryIcon(blog.category)}{" "}
                      {blog.category.replace("-", " ")}
                    </Badge>
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

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {blog.title}
                  </h1>

                  {/* Excerpt */}
                  <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>By {getAuthorName(blog.author)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{blogApi.formatDate(blog.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{blog.readingTime} min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{blog.views} views</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pb-6 border-b border-gray-700">
                    <Button
                      onClick={handleLike}
                      disabled={actionLoading === "like"}
                      variant="outline"
                      size="sm"
                      className={`${
                        liked
                          ? "border-casino-red text-casino-red bg-casino-red/10"
                          : "border-gray-600 text-gray-400 hover:border-casino-red hover:text-casino-red"
                      }`}
                    >
                      {actionLoading === "like" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            liked ? "fill-current" : ""
                          }`}
                        />
                      )}
                      {blog.likes}
                    </Button>

                    <Button
                      onClick={handleShare}
                      disabled={actionLoading === "share"}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:border-casino-neon hover:text-casino-neon"
                    >
                      {actionLoading === "share" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-2" />
                      )}
                      {blog.shares}
                    </Button>

                    <Button
                      onClick={handleBookmark}
                      variant="outline"
                      size="sm"
                      className={`${
                        bookmarked
                          ? "border-casino-gold text-casino-gold bg-casino-gold/10"
                          : "border-gray-600 text-gray-400 hover:border-casino-gold hover:text-casino-gold"
                      }`}
                    >
                      <Bookmark
                        className={`h-4 w-4 mr-2 ${
                          bookmarked ? "fill-current" : ""
                        }`}
                      />
                      Save
                    </Button>
                  </div>
                </header>

                {/* Featured Image */}
                {blog.featuredImage?.url && (
                  <div className="mb-8">
                    <img
                      src={blog.featuredImage.url}
                      alt={blog.featuredImage.alt || blog.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                    {blog.featuredImage.caption && (
                      <p className="text-sm text-gray-400 mt-2 text-center italic">
                        {blog.featuredImage.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div
                  className="prose prose-lg prose-invert max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:text-casino-gold prose-h2:border-b prose-h2:border-casino-gold/30 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:text-casino-neon
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-casino-gold prose-a:no-underline hover:prose-a:text-casino-gold/80
                    prose-strong:text-white prose-strong:font-semibold
                    prose-em:text-casino-neon prose-em:italic
                    prose-ul:text-gray-300 prose-ol:text-gray-300
                    prose-li:mb-2 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-casino-gold prose-blockquote:bg-casino-gold/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                    prose-code:text-casino-neon prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-medium">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-casino-neon/30 text-casino-neon hover:bg-casino-neon/10 cursor-pointer"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-casino-gold/20 rounded-full flex items-center justify-center">
                      {blog.author.profile.avatar ? (
                        <img
                          src={blog.author.profile.avatar}
                          alt={getAuthorName(blog.author)}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-casino-gold font-bold text-xl">
                          {getAuthorName(blog.author).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">
                        {getAuthorName(blog.author)}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Casino expert and content writer specializing in gaming
                        strategies and industry insights.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents (if needed) */}
                <Card className="casino-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-casino-gold" />
                      Quick Navigation
                    </h3>
                    <div className="space-y-2 text-sm">
                      <a
                        href="#"
                        className="block text-gray-400 hover:text-casino-gold transition-colors"
                      >
                        Introduction
                      </a>
                      <a
                        href="#"
                        className="block text-gray-400 hover:text-casino-gold transition-colors"
                      >
                        Key Strategies
                      </a>
                      <a
                        href="#"
                        className="block text-gray-400 hover:text-casino-gold transition-colors"
                      >
                        Tips & Tricks
                      </a>
                      <a
                        href="#"
                        className="block text-gray-400 hover:text-casino-gold transition-colors"
                      >
                        Conclusion
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <Card className="casino-card">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.map((post) => (
                          <Link
                            key={post._id}
                            to={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex space-x-3">
                              <div className="w-16 h-16 bg-gradient-to-br from-casino-purple/30 to-casino-red/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">
                                  {getCategoryIcon(post.category)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm group-hover:text-casino-gold transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>{post.readingTime} min</span>
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link to="/blog">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                        >
                          View All Articles
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Signup */}
                <Card className="casino-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Stay Updated
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Get the latest casino strategies and news delivered to
                      your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-casino-gold focus:outline-none"
                      />
                      <Button
                        className="w-full gold-gradient text-black font-semibold"
                        size="sm"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Categories */}
                <Card className="casino-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Popular Categories
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: "Game Strategies", count: 45, icon: "🎯" },
                        { name: "Casino News", count: 32, icon: "📰" },
                        { name: "Game Guides", count: 28, icon: "🎮" },
                        { name: "Tips & Tricks", count: 21, icon: "💡" },
                        { name: "Reviews", count: 18, icon: "⭐" },
                      ].map((category, index) => (
                        <Link
                          key={index}
                          to={`/blog?category=${category.name
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-gray-300 group-hover:text-casino-gold transition-colors">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {category.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Share */}
                <Card className="casino-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Share This Article
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        onClick={() => {
                          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            blog.title
                          )}&url=${encodeURIComponent(window.location.href)}`;
                          window.open(url, "_blank");
                        }}
                      >
                        🐦 Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
                        onClick={() => {
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`;
                          window.open(url, "_blank");
                        }}
                      >
                        📘 Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-white"
                        onClick={() => {
                          const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            window.location.href
                          )}`;
                          window.open(url, "_blank");
                        }}
                      >
                        💼 LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                        onClick={() => {
                          const url = `https://wa.me/?text=${encodeURIComponent(
                            blog.title + " " + window.location.href
                          )}`;
                          window.open(url, "_blank");
                        }}
                      >
                        💬 WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Comments Section (Optional) */}
          <div className="mt-12">
            <Card className="casino-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-casino-gold" />
                  Comments
                </h3>

                {/* Comment Form */}
                <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Leave a Comment
                  </h4>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-casino-gold focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-casino-gold focus:outline-none"
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Write your comment..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-casino-gold focus:outline-none resize-none"
                    />
                    <Button className="gold-gradient text-black font-semibold">
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Sample Comments */}
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-casino-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-casino-gold font-semibold">
                          J
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium">
                            John Doe
                          </span>
                          <span className="text-gray-400 text-sm">
                            2 hours ago
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                          Great article! These strategies really helped me
                          improve my game. Thanks for sharing such detailed
                          insights.
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-gold p-0 h-auto"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Like (5)
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-gold p-0 h-auto"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-casino-neon/20 rounded-full flex items-center justify-center">
                        <span className="text-casino-neon font-semibold">
                          S
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-white font-medium">
                            Sarah Wilson
                          </span>
                          <span className="text-gray-400 text-sm">
                            1 day ago
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                          I've been following your blog for months now, and
                          every article is pure gold. Keep up the excellent
                          work!
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-gold p-0 h-auto"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Like (12)
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-casino-gold p-0 h-auto"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="outline"
                      className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                    >
                      Load More Comments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation to Next/Previous Posts */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="casino-card group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <ArrowLeft className="h-8 w-8 text-casino-gold" />
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Previous Article
                    </p>
                    <h4 className="text-white font-semibold group-hover:text-casino-gold transition-colors">
                      Advanced Blackjack Strategies for Beginners
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="casino-card group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-right flex-1">
                    <p className="text-gray-400 text-sm mb-1">Next Article</p>
                    <h4 className="text-white font-semibold group-hover:text-casino-gold transition-colors">
                      Top 10 Slot Machines with Highest RTP
                    </h4>
                  </div>
                  <ArrowRight className="h-8 w-8 text-casino-gold" />
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

export default BlogPost;
