import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCreateProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "chaîne",
    sizes: [],
    colors: ["argent", "doré"],
    stock: 0,
    images: { argent: [], doré: [] },
    packagingImage: "",
    videoUrl: ""
  });
  const [sizesInput, setSizesInput] = useState("");

  // Collection DIAMOND UNIVERS
  const diamondProducts = [
    {
      name: "bague de fiançaille Lumina - Argent pur & diamant Moissanite",
      description: "Un cadeau romantique parfait, cette bague de fiançailles fine en argent pur avec diamant unique illumine l'amour. Design simple et original, symbole d'élégance et d'éternité.",
      category: "bague",
      price: 250000,
      sizes: ["50", "52", "54", "56"],
      colors: ["argent"],
      stock: 10,
      images: {
        argent: [
          "/Images/JH0A9575.jpg",
          "/Images/JH0A9678.jpg", 
          "/Images/JH0A9690.jpg"
        ]
      },
      packagingImage: "/Images/JH0A9831.jpg"
    },
    {
      name: "bague de fiançaille AÏNA- Argent pur* diamant Moissanite* zircon pierre",
      description: "La bague AÏNA associe un diamant central étincelant à un halo de petites pierres en zircon pour un rendu sophistiqué. Un bijou de luxe en argent pur, parfait pour une demande en mariage ou fiançailles.",
      category: "bague", 
      price: 320000,
      sizes: ["50", "52", "54", "56"],
      colors: ["argent"],
      stock: 8,
      images: {
        argent: [
          "/Images/JH0A3163_3.jpg",
          "/Images/JH0A3163_4.jpg",
          "/Images/JH0A3163_2.jpg"
        ]
      },
      packagingImage: "/Images/JH0A3163.jpg"
    },
    {
      name: "bague de fiançaille Héra- bague de fiançaille pour femme",
      description: "Offrez un cadeau précieux et inoubliable avec la bague Héra, diamant moissanite central et des pierres de zircon dans un design torsadé raffiné. Idéal pour symboliser l'amour et la douceur féminine.",
      category: "bague",
      price: 280000,
      sizes: ["50", "52", "54", "56"],
      colors: ["argent"],
      stock: 12,
      images: {
        argent: [
          "/Images/JH0A9850.jpg",
          "/Images/JH0A0631.jpg",
          "/Images/JH0A0060.jpg"
        ]
      },
      packagingImage: "/Images/JH0A0055.jpg"
    },
    {
      name: "chaine pour femme Lovéa",
      description: "Exprimez votre amour avec le collier Lovéa, un bijou élégant où trois diamants scintillants forment un cœur parfait. Idéal comme cadeau pour elle, ce collier en argent pur et diamants Moissanite allie raffinement, amour et luxe discret.",
      category: "chaîne",
      price: 180000,
      sizes: ["45 cm", "50 cm", "55 cm"],
      colors: ["argent"],
      stock: 15,
      images: {
        argent: [
          "/Images/JH0A8027.jpg",
          "/Images/JH0A8027_2.jpg"
        ]
      },
      packagingImage: "/Images/JH0A8027.jpg"
    },
    {
      name: "collier Lys - bijoux original pour femme",
      description: "Un bijou minimaliste et raffiné avec un diamant rond central comme médaille. Parfait pour les femmes qui aiment les bijoux fins et les bijoux élégants.",
      category: "chaîne",
      price: 150000,
      sizes: ["45 cm", "50 cm", "55 cm"],
      colors: ["argent"],
      stock: 20,
      images: {
        argent: [
          "/Images/Image_4.jpg",
          "/Images/Image_2.jpg"
        ]
      },
      packagingImage: "/Images/IMG de l'emballage que j'enverrais après"
    },
    {
      name: "Bracelet Véa- bijoux tendance",
      description: "Le bracelet Véa séduit par son œil central recouvert de diamants Moissanite, symbole de lumière et protection, un bijou tendance et moderne pour toutes les occasions.",
      category: "bracelet",
      price: 120000,
      sizes: ["16 cm", "18 cm", "20 cm"],
      colors: ["argent"],
      stock: 25,
      images: {
        argent: [
          "/Images/JH0A1768.jpg",
          "/Images/JH0A1768_1.jpg",
          "/Images/JH0A1768_2.jpg",
          "/Images/JH0A1768_3.jpg"
        ]
      },
      packagingImage: "/Images/JH0A1768.jpg"
    },
    {
      name: "Bracelet Lys – Éclat et féminité",
      description: "Offrez le bracelet Lys, un bijou précieux et lumineux avec diamant central et deux diamants secondaires. Idéal comme cadeau romantique ou bijou pour femme élégante.",
      category: "bracelet",
      price: 135000,
      sizes: ["16 cm", "18 cm", "20 cm"],
      colors: ["argent"],
      stock: 18,
      images: {
        argent: [
          "/Images/579A6473.jpg",
          "/Images/115A9447.jpg",
          "/Images/2X5A8099.jpg"
        ]
      },
      packagingImage: "/Images/579A6473.jpg"
    }
  ];

  const handleCreateProduct = async (productData: any) => {
    if (!user) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setLoading(true);
    try {
      await apiClient.createProduct(productData, token);
      toast.success(`Produit "${productData.name}" créé avec succès !`);
    } catch (error) {
      console.error('Create product error:', error);
      toast.error("Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAllProducts = async () => {
    for (const product of diamondProducts) {
      await handleCreateProduct(product);
      // Petit délai pour éviter les surcharges
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    toast.success("Tous les produits DIAMOND UNIVERS créés !");
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </button>
        <h1 className="font-display text-2xl font-semibold">Création des produits DIAMOND UNIVERS</h1>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold mb-4">Collection Luxury</h2>
          <p className="text-muted-foreground mb-4">
            Création automatique de tous les produits de la collection DIAMOND UNIVERS avec leurs images, descriptions et caractéristiques.
          </p>
          
          <button
            onClick={handleCreateAllProducts}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-btn text-btn-foreground hover:bg-btn-hover rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Créer tous les produits DIAMOND UNIVERS</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="font-display text-lg font-semibold mb-4">Liste des produits à créer</h3>
          
          {diamondProducts.map((product, index) => (
            <div key={index} className="border rounded-lg p-4 bg-secondary/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-lg mb-2">{product.name}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Catégorie:</span> {product.category}
                    </div>
                    <div>
                      <span className="font-medium">Prix:</span> {product.price.toLocaleString()} F CFA
                    </div>
                    <div>
                      <span className="font-medium">Tailles:</span> {product.sizes.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">Stock:</span> {product.stock}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="font-medium text-sm">Images:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(product.images).map(([color, images]) => (
                        <div key={color} className="text-xs">
                          <span className="font-medium capitalize">{color}:</span>
                          <div className="flex gap-1 mt-1">
                            {images.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`${product.name} - ${color} - ${imgIndex + 1}`}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {product.packagingImage && (
                    <div className="mt-3">
                      <span className="font-medium text-sm">Packaging:</span>
                      <img
                        src={product.packagingImage}
                        alt={`${product.name} - Packaging`}
                        className="w-16 h-16 object-cover rounded border mt-2"
                      />
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => handleCreateProduct(product)}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={14} />
                    Créer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
