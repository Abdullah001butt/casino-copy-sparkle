const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ImageUploadService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🖼️ ImageUpload Service initialized with base URL:', this.baseURL);
  }

  async uploadImage(file, folder = 'blog') {
    console.log('📤 Starting image upload:', { fileName: file.name, size: file.size, folder });
    
    try {
      // Validate file first
      this.validateImageFile(file);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const token = localStorage.getItem('adminToken');
      console.log('🔑 Using token:', token ? 'Token found' : 'No token');
      
      const uploadUrl = `${this.baseURL}/admin/upload/image`;
      console.log('🌐 Upload URL:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw error;
    }
  }

  // Validate image file
  validateImageFile(file, maxSize = 5 * 1024 * 1024) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    console.log('🔍 Validating file:', { type: file.type, size: file.size });

    if (!validTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Please upload JPEG, PNG, WebP, or GIF images.`);
    }

    if (file.size > maxSize) {
      throw new Error(`File size too large: ${this.formatFileSize(file.size)}. Maximum size is ${this.formatFileSize(maxSize)}.`);
    }

    console.log('✅ File validation passed');
    return true;
  }

  // Generate placeholder image URL
  getPlaceholderImage(category = 'blog', width = 800, height = 400) {
    const categoryIcons = {
      'strategies': '🎯',
      'game-guides': '🎮',
      'news': '📰',
      'tips-tricks': '💡',
      'reviews': '⭐',
      'promotions': '🎁',
      'winner-stories': '🏆',
      'responsible-gambling': '🛡️',
    };
    
    const icon = categoryIcons[category] || '📚';
    const placeholderUrl = `https://via.placeholder.com/${width}x${height}/1a1a1a/d4af37?text=${encodeURIComponent(icon + ' ' + category)}`;
    console.log('🖼️ Generated placeholder:', placeholderUrl);
    return placeholderUrl;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Test upload endpoint
  async testUploadEndpoint() {
    try {
      const testUrl = `${this.baseURL}/admin/upload/test`;
      const response = await fetch(testUrl);
      console.log('🧪 Upload endpoint test:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Upload endpoint test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
const imageUploadService = new ImageUploadService();
export default imageUploadService;

// Also export the class for testing
export { ImageUploadService };
