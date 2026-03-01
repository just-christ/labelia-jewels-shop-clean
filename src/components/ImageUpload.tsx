import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { apiClient } from "@/lib/api";

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  maxImages?: number;
  label?: string;
}

export default function ImageUpload({ 
  onImagesChange, 
  initialImages = [], 
  maxImages = 5,
  label = "Images du produit" 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images autorisées`);
      return;
    }

    setUploading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentification requise');
      }

      const uploadPromises = files.map(async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://labelia-backend.onrender.com/api/upload/single', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return `/uploads/${result.filename}`;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      
      setImages(newImages);
      onImagesChange(newImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        
        {/* Upload button */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                <span className="text-sm">Upload en cours...</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-sm">
                  {images.length >= maxImages 
                    ? `Maximum ${maxImages} images atteint` 
                    : `Cliquez pour ajouter des images (${images.length}/${maxImages})`
                  }
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG, GIF - Max 5MB par image
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Images preview */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Images téléchargées</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Utiliser un placeholder SVG inline au lieu d'une image qui n'existe pas
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23eee' width='60' height='60'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                  {image.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
