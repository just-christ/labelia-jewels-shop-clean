import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Function to get the first image for the product
  const getFirstImage = (product: Product) => {
    // Try to get the first image from any color
    if (product.images && typeof product.images === 'object') {
      const colors = Object.keys(product.images);
      for (const color of colors) {
        const colorImages = product.images[color];
        if (Array.isArray(colorImages) && colorImages.length > 0) {
          const firstImage = colorImages[0];
          console.log(`ProductCard: Found image ${firstImage} for color ${color}`);
          return `/Images/${firstImage}`;
        }
      }
    }
    
    // Fallback to placeholder
    console.log('ProductCard: No images found, using placeholder');
    const bgColor = product.colors?.[0] === 'doré' ? 'FFD700' : 'C0C0C0';
    return `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${bgColor}' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`;
  };
  
  return (
    <Link
        to={`/produit/${product.id}`}
        className="group block animate-fade-in"
      >
        <div className="aspect-square overflow-hidden bg-secondary rounded-sm mb-3">
        <img
          src={getFirstImage(product)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder on error
              const bgColor = product.colors?.[0] === 'doré' ? 'FFD700' : 'C0C0C0';
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${bgColor}' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>
        <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-0.5">
          {product.promoPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">{product.price.toLocaleString()} F CFA</span>
              <span className="text-sm font-semibold text-red-600">{product.promoPrice.toLocaleString()} F CFA</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{product.price.toLocaleString()} F CFA</p>
          )}
        </div>
        <button className="mt-2 w-full py-2.5 text-xs font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm">
          Voir
        </button>
      </Link>
  );
};

export default ProductCard;
