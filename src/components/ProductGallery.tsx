import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Package } from "lucide-react";

interface ProductGalleryProps {
  images: Record<string, string[]>; // { "argent": ["url1", "url2"], "doré": ["url1", "url2"] }
  selectedColor: string;
  packagingImage?: string;
  videoUrl?: string;
  productName: string;
}

export default function ProductGallery({ 
  images, 
  selectedColor, 
  packagingImage, 
  videoUrl, 
  productName 
}: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImages = images[selectedColor] || [];
  
  // Calculer l'image actuelle en fonction de l'index
  const getCurrentImage = () => {
    const videoOffset = videoUrl ? 1 : 0;
    const packagingIndex = currentImages.length + videoOffset;
    
    // Si c'est l'index du packaging
    if (packagingImage && currentImageIndex === packagingIndex) {
      return `/Images/${packagingImage}`;
    }
    
    // Si c'est une image normale du produit
    const productImageIndex = videoUrl ? currentImageIndex - 1 : currentImageIndex;
    if (productImageIndex >= 0 && productImageIndex < currentImages.length) {
      return `/Images/${currentImages[productImageIndex]}`;
    }
    
    return null;
  };
  
  const currentImage = getCurrentImage();

  const nextImage = () => {
    const totalImages = currentImages.length + (videoUrl ? 1 : 0) + (packagingImage ? 1 : 0);
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    const totalImages = currentImages.length + (videoUrl ? 1 : 0) + (packagingImage ? 1 : 0);
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main image/video */}
      <div className="relative aspect-square bg-secondary rounded-sm overflow-hidden group">
        {videoUrl && currentImageIndex === 0 ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={currentImage}
          />
        ) : (
          <img 
            src={currentImage || `/Images/placeholder.jpg`}
            alt={`${productName} - ${selectedColor}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder on error
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='16'%3EImage non disponible%3C/text%3E%3C/svg%3E`;
            }}
          />
        )}
        
        {/* Navigation arrows */}
        {currentImages.length > 1 || packagingImage && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Video indicator */}
        {videoUrl && currentImageIndex === 0 && (
          <div className="absolute top-2 left-2 p-2 rounded-full bg-black/50 text-white">
            <Play size={16} />
          </div>
        )}
      </div>

      {/* Thumbnail gallery */}
      <div className="grid grid-cols-4 gap-2">
        {videoUrl && (
          <button
            onClick={() => selectImage(0)}
            className={`relative aspect-square bg-secondary rounded-sm overflow-hidden border-2 transition-colors ${
              currentImageIndex === 0 ? "border-primary" : "border-transparent"
            }`}
          >
            <video
              src={videoUrl}
              muted
              className="w-full h-full object-cover"
              poster={currentImages[0]}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play size={20} className="text-white drop-shadow-lg" />
            </div>
          </button>
        )}
        
        {currentImages.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(videoUrl ? index + 1 : index)}
            className={`aspect-square bg-secondary rounded-sm overflow-hidden border-2 transition-colors ${
              currentImageIndex === (videoUrl ? index + 1 : index) ? "border-primary" : "border-transparent"
            }`}
          >
            <img
              src={`/Images/${image}`}
              alt={`${productName} - ${selectedColor} ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback to placeholder on error
                (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='8'%3E%3F%3C/text%3E%3C/svg%3E`;
              }}
            />
          </button>
        ))}

        {/* Packaging image */}
        {packagingImage && (
          <button
            onClick={() => selectImage(currentImages.length + (videoUrl ? 1 : 0))}
            className={`relative aspect-square bg-secondary rounded-sm overflow-hidden border-2 transition-colors ${
              currentImageIndex === currentImages.length + (videoUrl ? 1 : 0) ? "border-primary" : "border-transparent"
            }`}
          >
            <img
              src={`/Images/${packagingImage}`}
              alt="Packaging du produit"
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback to placeholder on error
                (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='8'%3E%3F%3C/text%3E%3C/svg%3E`;
              }}
            />
            <div className="absolute bottom-1 right-1 p-1 rounded bg-black/50">
              <Package size={12} className="text-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
