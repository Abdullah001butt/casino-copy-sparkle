const API_BASE_URL = "http://localhost:5000/api";

class AdminAPI {
  // Helper method to get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem("adminToken");
    console.log('🔑 Getting auth headers, token exists:', !!token);
    
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Add this missing method
  getToken() {
    return localStorage.getItem("adminToken");
  }

  // Add this missing method
  setToken(token) {
    localStorage.setItem("adminToken", token);
  }

  // Add this missing method
  removeToken() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
  }

  // Add this missing method
  isAuthenticated() {
    return !!this.getToken();
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const responseText = await response.text();
    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      body: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return JSON.parse(responseText);
  }

  // Helper method for making authenticated requests
  async makeRequest(url, options = {}) {
    const headers = this.getAuthHeaders();
    console.log('🚀 Making request:', {
      url: `${API_BASE_URL}${url}`,
      method: options.method || 'GET',
      hasToken: !!headers.Authorization
    });

    const config = {
      headers,
      mode: "cors",
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error("🚨 Admin API Error:", error);
      throw error;
    }
  }

  // ==================== AUTHENTICATION ====================
  async login(credentials) {
    console.log('🔐 Attempting login for:', credentials.email);
    
    const response = await this.makeRequest("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.data && response.data.token) {
      console.log('✅ Login successful, storing token');
      this.setToken(response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("adminRefreshToken", response.data.refreshToken);
      }
    }

    return response;
  }

  async logout() {
    try {
      await this.makeRequest("/auth/admin/logout", { method: "POST" });
    } finally {
      this.removeToken();
    }
  }

  async getCurrentAdmin() {
    console.log('👤 Getting current admin');
    return this.makeRequest("/auth/admin/me");
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem("adminRefreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/admin/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.removeToken();
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    if (data.data && data.data.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  // ==================== DASHBOARD STATS ====================
  async getDashboardStats() {
    return this.makeRequest("/admin/dashboard/stats");
  }

  async getRecentActivity() {
    return this.makeRequest("/admin/dashboard/activity");
  }

  async getAnalytics(period = "7d") {
    return this.makeRequest(`/admin/dashboard/analytics?period=${period}`);
  }

  // ==================== BLOG POSTS MANAGEMENT ====================
  async getAllPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `/admin/posts${queryString ? `?${queryString}` : ""}`;
    console.log('📝 Fetching posts:', url);
    return this.makeRequest(url);
  }

  async getPostById(id) {
    return this.makeRequest(`/admin/posts/${id}`);
  }

  async getPost(id) {
    return this.makeRequest(`/blogs/${id}`);
  }

  async createPost(postData) {
    return this.makeRequest('/blogs', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData) {
    return this.makeRequest(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id) {
    return this.makeRequest(`/admin/posts/${id}`, {
      method: "DELETE",
    });
  }

  async publishPost(id) {
    return this.makeRequest(`/admin/posts/${id}/publish`, {
      method: "PATCH",
    });
  }

  async unpublishPost(id) {
    return this.makeRequest(`/admin/posts/${id}/unpublish`, {
      method: "PATCH",
    });
  }

  // ==================== BULK OPERATIONS ====================
  async bulkUpdatePosts(postIds, updates) {
    return this.makeRequest("/admin/posts/bulk", {
      method: "PATCH",
      body: JSON.stringify({ postIds, updates }),
    });
  }

  async bulkDeletePosts(postIds) {
    return this.makeRequest("/admin/posts/bulk", {
      method: "DELETE",
      body: JSON.stringify({ postIds }),
    });
  }

  // ==================== USERS MANAGEMENT ====================
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(
      `/admin/users${queryString ? `?${queryString}` : ""}`
    );
  }

  async getUserById(id) {
    return this.makeRequest(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.makeRequest(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.makeRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== ERROR HANDLING UTILITIES ====================
  isAuthError(error) {
    return (
      error.message.includes("401") || error.message.includes("Unauthorized")
    );
  }

  isNetworkError(error) {
    return error.message.includes("fetch") || error.message.includes("Network");
  }

  isValidationError(error) {
    return (
      error.message.includes("400") || error.message.includes("validation")
    );
  }

  // ==================== UTILITY FUNCTIONS ====================
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }

  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatDateTime(date) {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
  }
}

// Create singleton instance
const adminApi = new AdminAPI();

// Export the singleton instance
export default adminApi;

// Also export the class for testing purposes
export { AdminAPI };
