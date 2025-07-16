const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class BlogAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("🚨 Blog API Error:", error);
      throw error;
    }
  }

  // Get all blogs with filters
  async getAllBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/blogs${queryString ? `?${queryString}` : ""}`);
  }

  // Search blogs
  async searchBlogs(params = {}) {
    return this.getAllBlogs(params);
  }

  // Get single blog by slug
  async getBlogBySlug(slug) {
    return this.makeRequest(`/blogs/${slug}`);
  }

  // Get featured blogs
  async getFeaturedBlogs(limit = 5) {
    return this.makeRequest(`/blogs/featured?limit=${limit}`);
  }

  // Get trending blogs
  async getTrendingBlogs(limit = 5) {
    return this.makeRequest(`/blogs/trending?limit=${limit}`);
  }

  // Get related blogs
  async getRelatedBlogs(postId, limit = 4) {
    return this.makeRequest(`/blogs/${postId}/related?limit=${limit}`);
  }

  // Get blog categories
  async getCategories() {
    return this.makeRequest("/blogs/categories");
  }

  // Get blog tags
  async getTags() {
    return this.makeRequest("/blogs/tags");
  }

  // Like a blog post
  async likeBlog(postId) {
    return this.makeRequest(`/blogs/${postId}/like`, {
      method: "POST",
    });
  }

  // Share a blog post
  async shareBlog(postId) {
    return this.makeRequest(`/blogs/${postId}/share`, {
      method: "POST",
    });
  }

  // Helper functions
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  formatDateTime(dateString) {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }
}

export default new BlogAPI();
