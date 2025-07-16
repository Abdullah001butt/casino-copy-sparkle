import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<string>;
  currentImage?: string;
  onImageRemove?: () => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  onImageRemove,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  label = "Featured Image",
  description = "Upload a featured image for your blog post"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      await onImageUpload(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [onImageUpload, maxSize, acceptedTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map(type => type.replace('image/', '.')),
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      {/* Label */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {/* Current Image Display */}
      {currentImage && (
        <Card className="casino-card">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={currentImage}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg"
              />
              {onImageRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onImageRemove}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="casino-card">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-casino-gold bg-casino-gold/10'
                : 'border-casino-gold/30 hover:border-casino-gold/60 hover:bg-casino-gold/5'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-2">
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6 text-casino-gold" />
                  <p className="text-sm text-gray-400">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-casino-gold" />
                  <p className="text-sm text-gray-400">
                    Drag & drop or click to upload an image
                  </p>
                  <p className="text-xs text-gray-500">
                    Max size: {maxSize}MB | Formats: JPEG, PNG, WebP, GIF
                  </p>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-sm text-red-500 mt-2">
              <AlertCircle className="mr-1 h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Tips */}
      <Card className="casino-card">
        <CardContent className="p-4">
          <h4 className="font-semibold text-casino-gold mb-3 flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            Image Tips for Better Engagement
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start space-x-2">
              <span className="text-casino-neon">•</span>
              <span>Use high-quality images that relate to your casino content</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-casino-neon">•</span>
              <span>Optimal size is 1200x630px for social media sharing</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-casino-neon">•</span>
              <span>Include casino elements like cards, chips, or slot machines</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-casino-neon">•</span>
              <span>Avoid images with too much text overlay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUpload;
