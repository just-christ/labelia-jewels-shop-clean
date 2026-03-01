import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

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

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    isPercentage: true,
    active: true,
    startDate: "",
    endDate: ""
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token d'authentification manquant");
        return;
      }
      const data = await apiClient.getPromotions(token);
      setPromotions(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Token d'authentification manquant");
        return;
      }
      
      if (editingId) {
        await apiClient.updatePromotion(editingId, form, token);
        toast.success("Promotion mise à jour !");
      } else {
        await apiClient.createPromotion(form, token);
        toast.success("Promotion créée !");
      }
      
      setForm({
        code: "",
        description: "",
        discount: "",
        isPercentage: true,
        active: true,
        startDate: "",
        endDate: ""
      });
      
      setEditingId(null);
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return;
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return toast.error("Token manquant");
      await apiClient.deletePromotion(id, token);
      toast.success("Promotion supprimée !");
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return toast.error("Token manquant");
      await apiClient.updatePromotion(id, { active: !currentActive }, token);
      toast.success(currentActive ? "Promotion désactivée !" : "Promotion activée !");
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingId(promotion.id);
    setForm({
      code: promotion.code,
      description: promotion.description || "",
      discount: promotion.discount.toString(),
      isPercentage: promotion.isPercentage,
      active: promotion.active,
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "",
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : ""
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-semibold mb-8">Gestion des Promotions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-semibold">
              {editingId ? "Modifier la promotion" : "Nouvelle promotion"}
            </h2>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    code: "",
                    description: "",
                    discount: "",
                    isPercentage: true,
                    active: true,
                    startDate: "",
                    endDate: ""
                  });
                }}
                className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Nouvelle promotion
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Code promotion</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="ex: SUMMER2024"
                className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                placeholder="Description de la promotion..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Type de réduction</label>
              <select
                value={form.isPercentage ? "percentage" : "fixed"}
                onChange={(e) => setForm({ ...form, isPercentage: e.target.value === "percentage" })}
                className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (F CFA)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Montant</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder={form.isPercentage ? "ex: 10" : "ex: 5000"}
                className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date de début</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date de fin</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 text-sm font-medium bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              {editingId ? "Mettre à jour" : "Créer la promotion"}
            </button>
          </form>
        </div>
        
        {/* Liste des promotions */}
        <div className="bg-card p-6 rounded-xl border">
          <h2 className="font-display text-2xl font-semibold mb-6">Liste des Promotions</h2>
          
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-medium">{promotion.code}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>
                      <p className="text-sm font-medium">
                        {promotion.isPercentage 
                          ? `${promotion.discount}% de réduction` 
                          : `${promotion.discount} F CFA de réduction`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Du: {new Date(promotion.startDate).toLocaleDateString()} au: {new Date(promotion.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Modifier
                      </button>
                      
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                      
                      <button
                        onClick={() => toggleActive(promotion.id, promotion.active)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                          promotion.active 
                            ? "bg-green-500 text-white hover:bg-green-600" 
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {promotion.active ? "Désactiver" : "Activer"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
