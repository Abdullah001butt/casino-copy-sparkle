import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PostForm from './PostForm';
import adminApi from '@/services/adminApi';
import { useToast } from '@/hooks/use-toast';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  featuredImage?: {
    url: string;
    alt: string;
    caption: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isTrending: boolean;
}

const AdminEditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApi.getPostById(id!);
      
      if (response.status === 'success') {
        setPost(response.data.post);
      } else {
        setError('Failed to load post');
      }
    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError(err.message || 'Failed to load post');
      toast({
        title: "Error",
        description: "Failed to load post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postData: any) => {
    try {
      const response = await adminApi.updatePost(id!, postData);
      
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Post updated successfully!",
        });
        navigate('/admin/posts');
      }
    } catch (err: any) {
      console.error('Error updating post:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update post",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/posts')}
            className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
        </div>
        
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-casino-gold animate-spin mx-auto mb-4" />
            <p className="text-xl text-gray-300">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/posts')}
            className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
        </div>
        
        <div className="text-center py-16">
          <p className="text-xl text-casino-red mb-4">{error || 'Post not found'}</p>
          <Button
            onClick={fetchPost}
            className="gold-gradient text-black font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/posts')}
          className="border-casino-gold text-casino-gold hover:bg-casino-gold hover:text-black"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
        <h1 className="text-3xl font-bold text-white">Edit Post</h1>
      </div>

      <PostForm
        mode="edit"
        initialData={post}
        onSave={handleSave}
        onCancel={() => navigate('/admin/posts')}
      />
    </div>
  );
};

export default AdminEditPost;
