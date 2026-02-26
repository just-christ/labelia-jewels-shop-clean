import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categories } from "@/data/products";
import { apiClient } from "@/lib/api";
import { Sparkles, Heart, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carrousel slides data
  const slides = [
    {
      image: "/Images/IMG_2084.jpg",
      title: "Collection DIAMOND UNIVERS",
      subtitle: "Des bijoux rares, des émotions précieuses",
      description: "Un trésor pour celle qui compte le plus...",
      buttonText: "Découvrir la collection",
      buttonLink: "/produits"
    },
    {
      image: "/Images/IMG_2125.jpg",
      title: "Élégance et Raffinement",
      subtitle: "Diamant moissanite et argent pur",
      description: "Conçus pour briller toute une vie",
      buttonText: "Explorer la collection",
      buttonLink: "/produits"
    },
    {
      image: "/Images/IMG_2107.jpg",
      title: "Le luxe de dire je t'aime...",
      subtitle: "Des bijoux, des promesses",
      description: "Célébrez vos plus beaux moments",
      buttonText: "Découvrir nos trésors",
      buttonLink: "/produits"
    }
  ];

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const products = await apiClient.getProducts();
        // Take first 3 products as best sellers (in real app, this would be based on sales data)
        setBestSellers(products.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch best sellers:', error);
      }
    };

    fetchBestSellers();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Function to get the first image for the product
  const getFirstImage = (product: any) => {
    // Try to get the first image from any color
    if (product.images && typeof product.images === 'object') {
      for (const color of Object.keys(product.images)) {
        const colorImages = product.images[color];
        if (Array.isArray(colorImages) && colorImages.length > 0) {
          return `/Images/${colorImages[0]}`;
        }
      }
    }
    
    // Fallback to placeholder
    const bgColor = product.colors?.[0] === 'doré' ? 'FFD700' : 'C0C0C0';
    return `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${bgColor}' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`;
  };

  return (
    <>
      {/* Hero Carousel */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-[85vh] flex items-center w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover object-center min-w-full min-h-full" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-background/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 z-10 p-3 md:p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors touch-manipulation"
          aria-label="Slide précédent"
        >
          <ChevronLeft size={28} className="md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 z-10 p-3 md:p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors touch-manipulation"
          aria-label="Slide suivant"
        >
          <ChevronRight size={28} className="md:w-6 md:h-6" />
        </button>

        {/* Slide content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-md">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-full absolute'
                }`}
              >
                <h1 className="font-display text-3xl md:text-6xl font-semibold leading-tight mb-3">
                  {slide.title}
                </h1>
                <p className="text-primary text-lg md:text-xl font-medium mb-3">
                  {slide.subtitle}
                </p>
                <p className="text-black text-base mb-6 leading-relaxed">
                  {slide.description}
                </p>
                <Link
                  to={slide.buttonLink}
                  className="inline-block px-8 py-3.5 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm"
                >
                  {slide.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-white/50'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-semibold text-center mb-12">Nos catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            // Convert frontend plural category to database singular category
            const dbCategory = cat.name === 'chaînes' ? 'chaîne' : 
                              cat.name === 'bracelets' ? 'bracelet' : 
                              cat.name === 'bagues' ? 'bague' : cat.name;
            return (
              <Link
                key={cat.name}
                to={`/produits?categorie=${cat.name}`}
                className="group relative bg-secondary rounded-sm p-10 text-center hover:bg-accent transition-colors"
              >
                <h3 className="font-display text-2xl font-medium group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">Voir la collection →</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-semibold mb-4">Nos Best Sellers</h2>
          <p className="text-muted-foreground text-lg">Les bijoux les plus appréciés de notre collection</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map((product, index) => (
            <div key={product.id} className="group">
              <Link to={`/produit/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-sm bg-secondary mb-4 group-hover:shadow-lg transition-shadow">
                  <img 
                    src={getFirstImage(product)} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder on error
                      const bgColor = product.colors?.[0] === 'doré' ? 'FFD700' : 'C0C0C0';
                      (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23${bgColor}' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Best Seller
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-medium group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-medium">{product.price.toLocaleString()} F CFA</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/produits"
            className="inline-block px-8 py-3.5 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* Why Labélia */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-semibold text-center mb-12">Pourquoi Labélia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Qualité premium", desc: "Des matériaux soigneusement sélectionnés pour une durabilité exceptionnelle." },
              { icon: Heart, title: "Design épuré", desc: "Des lignes minimalistes qui s'adaptent à tous les styles." },
              { icon: Shield, title: "Achat sécurisé", desc: "Paiement sécurisé et livraison soignée pour chaque commande." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="font-display text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
