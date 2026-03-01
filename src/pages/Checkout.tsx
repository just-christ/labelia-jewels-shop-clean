import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { generateReceipt } from "@/utils/generateReceipt";

export default function Checkout() {
  const { items, totalPrice, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate("/panier");
    return null;
  }

  const totalAfterDiscount = totalPrice - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.phone) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setSubmitting(true);

    const orderItems = items.map((i) => ({
      name: i.product.name,
      price: i.product.price,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
    }));

    try {
      const response = await apiClient.createOrder({
        customerName: form.name,
        customerEmail: form.email,
        customerAddress: form.address,
        customerPhone: form.phone,
        items: orderItems,
        total: totalAfterDiscount,
      });

      // Générer le numéro de commande depuis l'ID retourné par l'API
      const rawId = response?.id || String(Date.now());
      const orderNumber = rawId.replace(/\D/g, "").slice(-6).padStart(6, "0");

      // Générer et télécharger le reçu PDF
      generateReceipt({
        orderNumber,
        date: new Date().toLocaleDateString("fr-FR"),
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerAddress: form.address,
        items: items.map((i) => ({
          product: { name: i.product.name, price: i.product.price },
          color: i.color,
          size: i.size,
          quantity: i.quantity,
        })),
        subtotal: totalPrice,
        discount: discount,
        discountLabel: discount > 0 ? `-${discount.toLocaleString("fr-FR")} FCFA` : undefined,
        total: totalAfterDiscount,
      });

      toast.success("Commande confirmée ! Votre reçu PDF a été téléchargé. 🎉");
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la commande. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-semibold mb-8">Finaliser la commande</h1>

      <div className="border rounded-sm p-4 mb-8">
        <h2 className="font-medium text-sm mb-3">Récapitulatif</h2>
        {items.map((item) => (
          <div key={`${item.product.id}-${item.color}-${item.size}`} className="flex justify-between text-sm py-1.5">
            <span>
              {item.product.name}{" "}
              <span className="text-muted-foreground capitalize">
                ({item.color}, {item.size}) × {item.quantity}
              </span>
            </span>
            <span className="font-medium">{(item.product.price * item.quantity).toLocaleString()} F CFA</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-medium">
          <span>Total</span>
          <span className="text-lg">{totalAfterDiscount.toLocaleString()} F CFA</span>
        </div>
        {discount > 0 && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between">
            <span className="text-sm font-medium text-green-800">Réduction appliquée</span>
            <span className="text-sm font-semibold text-green-800">-{discount.toLocaleString()} F CFA</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { field: "name", label: "Nom complet", type: "text", placeholder: "Marie Dupont" },
          { field: "email", label: "Email", type: "email", placeholder: "marie@exemple.fr" },
          { field: "address", label: "Adresse de livraison", type: "text", placeholder: "12 rue des Lilas, 75001 Paris" },
          { field: "phone", label: "Téléphone", type: "tel", placeholder: "06 12 34 56 78" },
        ].map((f) => (
          <div key={f.field}>
            <label className="block text-sm font-medium mb-1.5">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.field as keyof typeof form]}
              onChange={(e) => update(f.field, e.target.value)}
              className="w-full border rounded-sm px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}

        <p className="text-xs text-muted-foreground mt-2">
          📄 Un reçu PDF sera automatiquement téléchargé à la confirmation.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm mt-6 disabled:opacity-50"
        >
          {submitting ? "Traitement..." : `Confirmer la commande — ${totalAfterDiscount.toLocaleString()} F CFA`}
        </button>
      </form>
    </section>
  );
}