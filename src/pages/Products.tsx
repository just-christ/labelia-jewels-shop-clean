import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categories, type Category } from "@/data/products";
import { apiClient } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  images: Record<string, string[]>;
  stock: number;
  packagingImage?: string;
  videoUrl?: string;
}

function getImageUrl(img: string): string {
  if (!img) return "";
  return img.startsWith("http") ? img : `/Images/${img}`;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("categorie") as Category | null;
  const [activeCategory, setActiveCategory] = useState<Category | "all">(initialCat || "all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(
    () => activeCategory === "all" ? products : products.filter((p) => {
      const dbCategory = activeCategory === 'chaînes' ? 'chaîne' :
                        activeCategory === 'bracelets' ? 'bracelet' :
                        activeCategory === 'bagues' ? 'bague' : activeCategory;
      return p.category === dbCategory;
    }),
    [activeCategory, products]
  );

  const handleFilter = (cat: Category | "all") => {
    setActiveCategory(cat);
    if (cat === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ categorie: cat });
    }
  };

  const getFirstImage = (images: Record<string, string[]>, colors: string[]) => {
    for (const color of Object.keys(images)) {
      if (images[color] && images[color].length > 0) return getImageUrl(images[color][0]);
    }
    const bgColor = colors?.[0] === 'doré' ? 'FFD700' : 'C0C0C0';
    return `data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${bgColor}' width='300' height='300' rx='16'/%3E%3C/svg%3E`;
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-center mb-2">Notre collection</h1>
      <p className="text-muted-foreground text-center mb-10">bijoux exclusifs, pensés pour vous.</p>

      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          onClick={() => handleFilter("all")}
          className={`px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm transition-colors ${
            activeCategory === "all" ? "bg-btn text-btn-foreground" : "bg-secondary text-foreground hover:bg-accent"
          }`}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleFilter(cat.name)}
            className={`px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm transition-colors ${
              activeCategory === cat.name ? "bg-btn text-btn-foreground" : "bg-secondary text-foreground hover:bg-accent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Link key={product.id} to={`/produit/${product.id}`} className="group">
              <div className="relative overflow-hidden rounded-sm bg-secondary mb-4">
                <img
                  src={getFirstImage(product.images, product.colors)}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {product.videoUrl && (
                  <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-medium group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.promoPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{product.price.toLocaleString()} F CFA</span>
                    <span className="text-lg font-display font-semibold text-red-600">{product.promoPrice.toLocaleString()} F CFA</span>
                  </div>
                ) : (
                  <span className="text-2xl font-display font-medium text-foreground">{product.price.toLocaleString()} F CFA</span>
                )}
                
                {/* Statut du stock */}
                {product.stock === 0 && (
                  <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    Rupture de stock
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}