import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Gift, Tag, Plus, Trash2, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

interface Promotion {
  id: string;
  code: string;
  description?: string;
  discount: number;
  isPercentage: boolean;
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  percentage?: number;
  isPercentage: boolean;
  isUsed: boolean;
  usedAt?: string;
  usedBy?: string;
  createdAt: string;
}

const emptyForm = {
  code: "",
  description: "",
  discount: "",
  isPercentage: true,
  active: true,
  startDate: "",
  endDate: "",
};

const emptyGiftCardForm = {
  amount: "",
  percentage: "",
  isPercentage: false,
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"promotions" | "giftcards">("promotions");

  // Promotion dialog
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Gift card dialog
  const [gcDialogOpen, setGcDialogOpen] = useState(false);
  const [giftCardForm, setGiftCardForm] = useState(emptyGiftCardForm);

  const { user } = useAuth();

  useEffect(() => {
    fetchPromotions();
    fetchGiftCards();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return toast.error("Token d'authentification manquant");
      const data = await apiClient.getPromotions(token);
      setPromotions(data);
    } catch {
      toast.error("Erreur lors du chargement des promotions");
    } finally {
      setLoading(false);
    }
  };

  const fetchGiftCards = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return toast.error("Token d'authentification manquant");
      const data = await apiClient.getGiftCards(token);
      setGiftCards(data);
    } catch {
      toast.error("Erreur lors du chargement des cartes cadeaux");
    }
  };

  // ── Promotions ──────────────────────────────────────────────────────────

  const openCreatePromo = () => {
    setEditingPromo(null);
    setForm(emptyForm);
    setPromoDialogOpen(true);
  };

  const openEditPromo = (p: Promotion) => {
    setEditingPromo(p);
    setForm({
      code: p.code,
      description: p.description || "",
      discount: p.discount.toString(),
      isPercentage: p.isPercentage,
      active: p.active,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "",
      endDate: p.endDate ? new Date(p.endDate).toISOString().split("T")[0] : "",
    });
    setPromoDialogOpen(true);
  };

  const handleSavePromo = async () => {
    if (!user) return;
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Token manquant");
    try {
      if (editingPromo) {
        await apiClient.updatePromotion(editingPromo.id, form, token);
        toast.success("Promotion mise à jour !");
      } else {
        await apiClient.createPromotion(form, token);
        toast.success("Promotion créée !");
      }
      setPromoDialogOpen(false);
      fetchPromotions();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Token manquant");
    try {
      await apiClient.deletePromotion(id, token);
      toast.success("Promotion supprimée !");
      fetchPromotions();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Token manquant");
    try {
      await apiClient.updatePromotion(id, { active: !current }, token);
      toast.success(current ? "Promotion désactivée" : "Promotion activée");
      fetchPromotions();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // ── Gift Cards ──────────────────────────────────────────────────────────

  const handleCreateGiftCard = async () => {
    if (!user) return;
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("Token manquant");

    const { amount, percentage, isPercentage } = giftCardForm;

    if (isPercentage && (!percentage || parseFloat(percentage) <= 0 || parseFloat(percentage) > 100)) {
      return toast.error("Le pourcentage doit être entre 1 et 100");
    }
    if (!isPercentage && (!amount || parseFloat(amount) <= 0)) {
      return toast.error("Le montant doit être supérieur à 0");
    }

    try {
      await apiClient.createGiftCard(
        parseFloat(amount),
        isPercentage ? parseFloat(percentage) : null,
        isPercentage,
        token
      );
      toast.success("Carte cadeau créée !");
      setGiftCardForm(emptyGiftCardForm);
      setGcDialogOpen(false);
      fetchGiftCards();
    } catch {
      toast.error("Erreur lors de la création");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Code copié !");
    } catch {
      toast.error("Erreur lors de la copie");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Promotions & Cartes cadeaux</h1>
        <p className="text-muted-foreground text-sm mt-1">Gérez vos codes promo et cartes cadeaux</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("promotions")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "promotions"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag size={15} />
          Promotions
        </button>
        <button
          onClick={() => setActiveTab("giftcards")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "giftcards"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Gift size={15} />
          Cartes cadeaux
        </button>
      </div>

      {/* ── TAB : PROMOTIONS ── */}
      {activeTab === "promotions" && (
        <div className="bg-card border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <h2 className="font-display text-lg font-semibold">Promotions</h2>
            <button
              onClick={openCreatePromo}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              <Plus size={15} />
              Nouvelle promotion
            </button>
          </div>

          {loading ? (
            <p className="text-muted-foreground text-sm">Chargement...</p>
          ) : promotions.length === 0 ? (
            <div className="text-center py-14 border border-dashed rounded-xl">
              <Tag size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Aucune promotion. Créez-en une !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {promotions.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold">{p.code}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {p.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.isPercentage ? `${p.discount}% de réduction` : `${p.discount.toLocaleString()} F CFA`}
                      {p.startDate && p.endDate && (
                        <> · {new Date(p.startDate).toLocaleDateString("fr-FR")} → {new Date(p.endDate).toLocaleDateString("fr-FR")}</>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggleActive(p.id, p.active)}
                      className="p-1.5 hover:text-primary transition-colors rounded"
                      title={p.active ? "Désactiver" : "Activer"}
                    >
                      {p.active ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} />}
                    </button>
                    <button
                      onClick={() => openEditPromo(p)}
                      className="p-1.5 hover:text-primary transition-colors rounded"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 hover:text-destructive transition-colors rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB : CARTES CADEAUX ── */}
      {activeTab === "giftcards" && (
        <div className="bg-card border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <h2 className="font-display text-lg font-semibold">Cartes cadeaux</h2>
            <button
              onClick={() => setGcDialogOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              <Plus size={15} />
              Nouvelle carte
            </button>
          </div>

          {loading ? (
            <p className="text-muted-foreground text-sm">Chargement...</p>
          ) : giftCards.length === 0 ? (
            <div className="text-center py-14 border border-dashed rounded-xl">
              <Gift size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Aucune carte cadeau. Créez-en une !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {giftCards.map((gc) => (
                <div
                  key={gc.id}
                  className={`flex items-center justify-between p-3 rounded-lg gap-3 ${
                    gc.isUsed ? "bg-secondary/10 opacity-60" : "bg-secondary/30"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold">{gc.code}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          gc.isUsed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {gc.isUsed ? "Utilisée" : "Disponible"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {gc.isPercentage
                        ? `${gc.percentage}% de réduction`
                        : `${gc.amount.toLocaleString()} F CFA`}
                      {gc.usedAt && <> · Utilisée le {new Date(gc.usedAt).toLocaleDateString("fr-FR")}</>}
                      {gc.usedBy && <> par {gc.usedBy}</>}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gc.code)}
                    className="p-1.5 hover:text-primary transition-colors rounded shrink-0"
                    title="Copier le code"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DIALOG : Promotion ── */}
      <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
        <DialogContent className="w-full max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingPromo ? "Modifier la promotion" : "Nouvelle promotion"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Code promotion</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="ex: SUMMER2024"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                placeholder="Description de la promotion..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={form.isPercentage ? "percentage" : "fixed"}
                  onChange={(e) => setForm({ ...form, isPercentage: e.target.value === "percentage" })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Fixe (F CFA)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Montant</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder={form.isPercentage ? "10" : "5000"}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date début</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date fin</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded"
              />
              Promotion active
            </label>

            <button
              onClick={handleSavePromo}
              className="w-full py-2.5 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              {editingPromo ? "Enregistrer les modifications" : "Créer la promotion"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG : Carte cadeau ── */}
      <Dialog open={gcDialogOpen} onOpenChange={setGcDialogOpen}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Nouvelle carte cadeau</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-2">Type de réduction</label>
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setGiftCardForm({ ...giftCardForm, isPercentage: false })}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    !giftCardForm.isPercentage ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Montant fixe
                </button>
                <button
                  type="button"
                  onClick={() => setGiftCardForm({ ...giftCardForm, isPercentage: true })}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    giftCardForm.isPercentage ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
                  }`}
                >
                  Pourcentage
                </button>
              </div>
            </div>

            {giftCardForm.isPercentage ? (
              <div>
                <label className="block text-sm font-medium mb-1">Pourcentage (%)</label>
                <input
                  type="number"
                  value={giftCardForm.percentage}
                  onChange={(e) => setGiftCardForm({ ...giftCardForm, percentage: e.target.value })}
                  placeholder="ex: 20"
                  min="1"
                  max="100"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Montant (F CFA)</label>
                <input
                  type="number"
                  value={giftCardForm.amount}
                  onChange={(e) => setGiftCardForm({ ...giftCardForm, amount: e.target.value })}
                  placeholder="ex: 10000"
                  min="100"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            )}

            <button
              onClick={handleCreateGiftCard}
              className="w-full py-2.5 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              Créer la carte cadeau
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}