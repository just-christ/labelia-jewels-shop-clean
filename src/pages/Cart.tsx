import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Tag } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Veuillez entrer un code promo");
      return;
    }
    
    try {
      const response = await apiClient.validatePromoCode(promoCode);
      
      if (response.valid) {
        // Calculer la réduction
        let discountAmount = 0;
        if (response.promotion.isPercentage) {
          discountAmount = (totalPrice * response.promotion.discount) / 100;
        } else {
          discountAmount = response.promotion.discount;
        }
        
        setDiscount(discountAmount);
        toast.success(`Code promo appliqué : -${discountAmount.toLocaleString()} F CFA`);
      } else {
        toast.error(response.message || "Code promo invalide");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation du code promo");
    }
  };

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">Découvrez notre collection pour trouver le bijou parfait.</p>
        <Link
          to="/produits"
          className="inline-block px-8 py-3 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm"
        >
          Voir les produits
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-4xl font-semibold mb-8">Votre panier</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.color}-${item.size}`}
            className="flex gap-4 p-4 border rounded-sm"
          >
            <div className="w-20 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
              <img
                src={item.product.images[item.color]?.[0] 
                  ? `/Images/${item.product.images[item.color][0]}` 
                  : `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23C0C0C0' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(item.product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`}
                alt={item.product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-medium">{item.product.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {item.color} · {item.size}
              </p>
              <p className="text-sm font-medium mt-1">{item.product.price.toLocaleString()} F CFA</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-sm hover:bg-secondary transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.color, item.size, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-sm hover:bg-secondary transition-colors"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => removeItem(item.product.id, item.color, item.size)}
                className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t mt-8 pt-6">
        {/* Promo Code Section */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code promo"
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleApplyPromoCode}
              className="px-6 py-3 text-sm font-medium bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              Appliquer
            </button>
          </div>
          
          {discount > 0 && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-sm font-medium text-green-800">Réduction appliquée</span>
              <span className="text-sm font-semibold text-green-800">-{discount.toLocaleString()} F CFA</span>
            </div>
          )}
        </div>

        {/* Total Section */}
        <div className="space-y-2">
          {discount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{totalPrice.toLocaleString()} F CFA</span>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <span className="font-display text-xl font-medium">Total</span>
            <span className="font-display text-2xl font-semibold">
              {(totalPrice - discount).toLocaleString()} F CFA
            </span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="block w-full py-4 text-center text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm"
        >
          Passer commande
        </Link>
      </div>
    </section>
  );
}
