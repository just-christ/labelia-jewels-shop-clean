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
      await apiClient.deletePromotion(id);
      toast.success("Promotion supprimée !");
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await apiClient.updatePromotion(id, { active: false });
      toast.success("Promotion désactivée !");
      fetchPromotions();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-semibold mb-8">Gestion des Promotions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="bg-card p-6 rounded-xl border">
          <h2 className="font-display text-2xl font-semibold mb-6">
            {editingId ? "Modifier la promotion" : "Nouvelle promotion"}
          </h2>
          
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
                onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) })}
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
                  <div className="flex justify-between items-start mb-4">
                    <div>
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
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                      
                      <button
                        onClick={() => toggleActive(promotion.id)}
                        className={`p-2 rounded-lg transition-colors ${
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
