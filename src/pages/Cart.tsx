import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

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
                src={item.product.images[item.color]?.[0] || `data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23C0C0C0' width='200' height='200' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='14' font-weight='bold'%3E${encodeURIComponent(item.product.name.substring(0, 10))}%3C/text%3E%3C/svg%3E`}
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
        <div className="flex justify-between items-center mb-6">
          <span className="font-display text-xl font-medium">Total</span>
          <span className="font-display text-2xl font-semibold">{totalPrice.toLocaleString()} F CFA</span>
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
