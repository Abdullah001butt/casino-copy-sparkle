import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PostForm from './PostForm';
import adminApi from '@/services/adminApi';
import { useToast } from '@/hooks/use-toast';

const AdminCreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = async (postData: any) => {
    try {
      const response = await adminApi.createPost(postData);
      
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Post created successfully!",
        });
        navigate('/admin/posts');
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to create post",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-3xl font-bold text-white">Create New Post</h1>
      </div>

      <PostForm
        mode="create"
        onSave={handleSave}
        onCancel={() => navigate('/admin/posts')}
      />
    </div>
  );
};

export default AdminCreatePost;
