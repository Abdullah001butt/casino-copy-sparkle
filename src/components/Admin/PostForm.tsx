import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Eye,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApi from "@/services/adminApi";
import imageUpload from "@/services/imageUpload";

interface PostFormProps {
  mode: "create" | "edit";
}

interface PostData {
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
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  status: "draft" | "published";
  isFeatured: boolean;
  isTrending: boolean;
  readingTime: number;
}

const PostForm: React.FC<PostFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState<PostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "strategies",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    status: "draft",
    isFeatured: false,
    isTrending: false,
    readingTime: 5,
  });

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const categories = [
    { value: "strategies", label: "Strategies" },
    { value: "game-guides", label: "Game Guides" },
    { value: "news", label: "News" },
    { value: "tips-tricks", label: "Tips & Tricks" },
    { value: "reviews", label: "Reviews" },
    { value: "promotions", label: "Promotions" },
    { value: "winner-stories", label: "Winner Stories" },
    { value: "responsible-gambling", label: "Responsible Gaming" },
  ];

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchPost();
    }
  }, [mode, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getPost(id!);
      if (response.status === "success") {
        const post = response.data.post;
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          category: post.category || "strategies",
          tags: post.tags || [],
          featuredImage: post.featuredImage,
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
          keywords: post.keywords || [],
          status: post.status || "draft",
          isFeatured: post.isFeatured || false,
          isTrending: post.isTrending || false,
          readingTime: post.readingTime || 5,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load post data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const handleInputChange = (field: keyof PostData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const response = await imageUpload.uploadImage(file, "blog");

      if (response.status === "success") {
        setFormData((prev) => ({
          ...prev,
          featuredImage: {
            url: `http://localhost:5000${response.data.url}`,
            alt: formData.title || "Blog post image",
            caption: "",
          },
        }));

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    } catch (error) {
      console.error("❌ Image upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: undefined,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((keyword) => keyword !== keywordToRemove),
    }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    try {
      setLoading(true);

      // Validation
      if (!formData.title.trim()) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.excerpt.trim()) {
        toast({
          title: "Error",
          description: "Excerpt is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.content.trim()) {
        toast({
          title: "Error",
          description: "Content is required",
          variant: "destructive",
        });
        return;
      }

      const postData = {
        ...formData,
        status,
        publishedAt:
          status === "published" ? new Date().toISOString() : undefined,
      };

      let response;
      if (mode === "create") {
        response = await adminApi.createPost(postData);
      } else {
        response = await adminApi.updatePost(id!, postData);
      }

      if (response.status === "success") {
        toast({
          title: "Success",
          description: `Post ${
            mode === "create" ? "created" : "updated"
          } successfully`,
        });
        navigate("/admin/posts");
      }
    } catch (error: any) {
      console.error("❌ Error saving post:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode} post`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    if (formData.slug) {
      window.open(`/blog/${formData.slug}`, "_blank");
    }
  };

  if (loading && mode === "edit") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-300">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/admin/posts")}
            variant="outline"
            className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {mode === "create" ? "Create New Post" : "Edit Post"}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
            disabled={!formData.slug}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit("published")}
            disabled={loading}
            className="gold-gradient text-black font-semibold"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="post-slug"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL: /blog/{formData.slug}
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt *
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.excerpt.length}/500 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-casino-gold focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your post content here... (HTML supported)"
                rows={20}
                className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                HTML tags are supported. Use proper formatting for better
                readability.
              </p>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Title
                </label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    handleInputChange("metaTitle", e.target.value)
                  }
                  placeholder="SEO title (leave empty to use post title)"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    handleInputChange("metaDescription", e.target.value)
                  }
                  placeholder="SEO description (leave empty to use excerpt)"
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Keywords
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword..."
                    className="bg-gray-800 border-gray-700 text-white"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addKeyword}
                    variant="outline"
                    className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-casino-neon text-casino-neon"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 hover:text-casino-red"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={formData.featuredImage.url}
                      alt={formData.featuredImage.alt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-casino-red text-white rounded-full p-1 hover:bg-casino-red/80"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    value={formData.featuredImage.alt}
                    onChange={(e) =>
                      handleInputChange("featuredImage", {
                        ...formData.featuredImage,
                        alt: e.target.value,
                      })
                    }
                    placeholder="Alt text"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Input
                    value={formData.featuredImage.caption || ""}
                    onChange={(e) =>
                      handleInputChange("featuredImage", {
                        ...formData.featuredImage,
                        caption: e.target.value,
                      })
                    }
                    placeholder="Caption (optional)"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-casino-gold transition-colors"
                  >
                    {imageUploading ? (
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-casino-gold animate-spin mx-auto mb-2" />
                        <p className="text-gray-400">Uploading...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag..."
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-casino-neon text-casino-neon"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-casino-red"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Post Settings */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Reading Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reading Time (minutes)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.readingTime}
                  onChange={(e) =>
                    handleInputChange(
                      "readingTime",
                      parseInt(e.target.value) || 5
                    )
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange("isFeatured", e.target.checked)
                  }
                  className="w-4 h-4 text-casino-gold bg-gray-800 border-gray-600 rounded focus:ring-casino-gold focus:ring-2"
                />
                <label
                  htmlFor="featured"
                  className="text-gray-300 cursor-pointer"
                >
                  Featured Post
                </label>
              </div>

              {/* Trending Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="trending"
                  checked={formData.isTrending}
                  onChange={(e) =>
                    handleInputChange("isTrending", e.target.checked)
                  }
                  className="w-4 h-4 text-casino-gold bg-gray-800 border-gray-600 rounded focus:ring-casino-gold focus:ring-2"
                />
                <label
                  htmlFor="trending"
                  className="text-gray-300 cursor-pointer"
                >
                  Trending Post
                </label>
              </div>

              {/* Status Display */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Status
                </label>
                <Badge
                  className={`${
                    formData.status === "published"
                      ? "bg-green-600/20 text-green-400 border-green-600/30"
                      : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                  } border`}
                >
                  {formData.status === "published"
                    ? "✅ Published"
                    : "📝 Draft"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSubmit("draft")}
                disabled={loading}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save as Draft
              </Button>

              <Button
                onClick={() => handleSubmit("published")}
                disabled={loading}
                className="w-full gold-gradient text-black font-semibold"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {formData.status === "published"
                  ? "Update Post"
                  : "Publish Now"}
              </Button>

              {formData.slug && (
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  className="w-full border-casino-neon text-casino-neon hover:bg-casino-neon hover:text-black"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Post
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Help & Tips */}
          <Card className="casino-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-casino-gold" />
                Writing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start space-x-2">
                  <span className="text-casino-gold">•</span>
                  <span>Use clear, engaging headlines that grab attention</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-casino-gold">•</span>
                  <span>Keep excerpts under 160 characters for better SEO</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-casino-gold">•</span>
                  <span>Add relevant tags to improve discoverability</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-casino-gold">•</span>
                  <span>Use featured images to make posts more appealing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-casino-gold">•</span>
                  <span>Structure content with headings and bullet points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
