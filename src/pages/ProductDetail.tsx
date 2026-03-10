import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { type Color } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/api";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductGallery from "@/components/ProductGallery";
import { Ruler, Check, Eye } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: Record<string, string[]>;
  packagingImage?: string;
  videoUrl?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState<Color>("doré");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [viewersCount, setViewersCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await apiClient.getProductById(id);
        setProduct(data);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0] as Color);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const generateViewersCount = () => Math.floor(Math.random() * 21) + 8;
    setViewersCount(generateViewersCount());
    const interval = setInterval(() => setViewersCount(generateViewersCount()), 10800000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl mb-4">Produit introuvable</h1>
      <button onClick={() => navigate("/produits")} className="text-primary underline">Retour aux produits</button>
    </div>
  );

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Veuillez sélectionner une taille.");
      return;
    }
    
    // Vérifier si le produit est en rupture de stock
    if (product.stock === 0) {
      toast.error("Ce produit est actuellement en rupture de stock.");
      return;
    }
    
    const cartProduct = {
      ...product,
      category: product.category as any,
      colors: product.colors as any[],
      images: product.images as any,
    };
    addItem(cartProduct, selectedColor, selectedSize || "unique");
    toast.success(`${product.name} ajouté au panier !`);
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
        ← Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery
          images={product.images}
          selectedColor={selectedColor}
          packagingImage={product.packagingImage}
          videoUrl={product.videoUrl}
          productName={product.name}
        />

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">{product.category}</p>
          <h1 className="font-display text-4xl font-semibold mb-2">{product.name}</h1>

          {/* Prix — barré si promo */}
          {product.promoPrice ? (
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-display text-muted-foreground line-through">{product.price.toLocaleString()} F CFA</span>
              <span className="text-3xl font-display font-semibold text-red-600">{product.promoPrice.toLocaleString()} F CFA</span>
            </div>
          ) : (
            <span className="text-3xl font-display font-medium mb-2">{product.price.toLocaleString()} F CFA</span>
          )}

          {/* Statut du stock */}
          <div className="mb-4">
            {product.stock === 0 ? (
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                En rupture de stock
              </div>
            ) : product.stock <= 5 ? (
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                Plus que {product.stock} exemplaire{product.stock > 1 ? 's' : ''} disponible{product.stock > 1 ? 's' : ''}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                En stock
              </div>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          {/* Color selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Couleur : <span className="text-muted-foreground capitalize">{selectedColor}</span></p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color as Color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor === color ? "border-foreground scale-110" : "border-border"
                  } ${color === "doré" ? "bg-gold" : "bg-silver"}`}
                  aria-label={color}
                >
                  {selectedColor === color && <Check size={14} className="text-background" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector — uniquement si le produit a des tailles */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Taille</p>
                {product.category === "bague" && (
                  <button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <Ruler size={14} />
                    Guide des tailles
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm rounded-sm border transition-colors ${
                      selectedSize === size ? "bg-btn text-btn-foreground border-btn" : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAdd} 
            disabled={product.stock === 0}
            className={`w-full py-4 text-sm font-medium tracking-wider uppercase rounded-sm mt-4 transition-colors ${
              product.stock === 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-btn text-btn-foreground hover:bg-btn-hover"
            }`}
          >
            {product.stock === 0 ? "En rupture de stock" : "Ajouter au panier"}
          </button>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="relative">
              <Eye size={14} className="text-green-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span>{viewersCount} personne{viewersCount > 1 ? "s" : ""} regardent ce produit</span>
          </div>
        </div>
      </div>

      {product.category === "bague" && (
        <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} category={product.category as any} />
      )}
    </section>
  );
}