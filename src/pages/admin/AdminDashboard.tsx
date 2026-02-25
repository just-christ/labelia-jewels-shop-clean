import { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, TrendingUp, Plus, Trash2, Edit, Eye } from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchAdminUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const products = await apiClient.getProducts();
      const token = localStorage.getItem("authToken");

      if (!token || token === "null" || token === "undefined") {
        setStats({ totalProducts: products.length, totalOrders: 0, totalUsers: 1, totalRevenue: 0, recentOrders: [] });
        return;
      }

      const orders = await apiClient.getOrders(token);
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: 1,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0),
        recentOrders: orders.slice(0, 5),
      });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      // Gérer les erreurs d'authentification
      if (error.message?.includes('403') || error.message?.includes('Forbidden') || error.message?.includes('Invalid token')) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        // Nettoyer le token et rediriger
        localStorage.removeItem('authToken');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        toast.error("Erreur lors du chargement des statistiques");
      }
    }
  };

  const fetchAdminUsers = async () => {
    setAdminUsers([{ id: "1", email: "admin@labelia.fr", role: "admin", createdAt: new Date().toISOString() }]);
  };

  const handleAddAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newAdminPassword.length < 6) { toast.error("Mot de passe trop court (min. 6 caractères)."); return; }
    setLoading(true);
    try {
      const newAdmin: AdminUser = { id: Date.now().toString(), email: newAdminEmail, role: "admin", createdAt: new Date().toISOString() };
      setAdminUsers([...adminUsers, newAdmin]);
      setNewAdminEmail(""); setNewAdminPassword(""); setShowAddAdmin(false);
      toast.success("Compte admin créé !");
    } catch { toast.error("Erreur lors de la création."); }
    finally { setLoading(false); }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Supprimer ce compte admin ?")) return;
    setAdminUsers(adminUsers.filter((u) => u.id !== id));
    toast.success("Compte supprimé !");
  };

  const statCards = [
    { label: "Produits", value: stats.totalProducts, icon: Package, color: "from-amber-500/10 to-amber-600/5 border-amber-500/20", iconColor: "text-amber-600 bg-amber-500/15" },
    { label: "Commandes", value: stats.totalOrders, icon: ShoppingCart, color: "from-green-500/10 to-green-600/5 border-green-500/20", iconColor: "text-green-600 bg-green-500/15" },
    { label: "Clients", value: stats.totalUsers, icon: Users, color: "from-blue-500/10 to-blue-600/5 border-blue-500/20", iconColor: "text-blue-600 bg-blue-500/15" },
    { label: "Revenus", value: `${stats.totalRevenue.toLocaleString()} F`, icon: TrendingUp, color: "from-purple-500/10 to-purple-600/5 border-purple-500/20", iconColor: "text-purple-600 bg-purple-500/15" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Bienvenue, {user?.email}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border rounded-xl p-4 md:p-5`}>
            <div className={`inline-flex p-2 rounded-lg mb-3 ${iconColor}`}>
              <Icon size={18} />
            </div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-xl md:text-2xl font-bold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Voir produits", path: "/admin/produits", icon: Package },
          { label: "Commandes", path: "/admin/commandes", icon: ShoppingCart },
          { label: "Clients", path: "/admin/clients", icon: Users },
        ].map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex items-center gap-2 px-4 py-3 text-sm bg-secondary hover:bg-secondary/70 rounded-xl transition-colors font-medium"
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="bg-card border rounded-xl p-4 md:p-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye size={18} className="text-primary" />
          Commandes récentes
        </h2>
        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-sm font-semibold">{order.totalAmount?.toLocaleString()} F</p>
                  <p className="text-xs text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admins — cartes au lieu d'un tableau */}
      <div className="bg-card border rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h2 className="font-display text-lg font-semibold">Administrateurs</h2>
          <button
            onClick={() => setShowAddAdmin(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
          >
            <Plus size={15} />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {adminUsers.map((adminUser) => (
            <div key={adminUser.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{adminUser.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{adminUser.role} · {new Date(adminUser.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 hover:text-primary transition-colors rounded">
                  <Edit size={14} />
                </button>
                {adminUser.email !== "admin@labelia.fr" && (
                  <button onClick={() => handleDeleteAdmin(adminUser.id)} className="p-1.5 hover:text-destructive transition-colors rounded">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal ajout admin */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-display text-lg font-semibold mb-4">Nouvel administrateur</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 text-sm font-medium bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg disabled:opacity-50"
                >
                  {loading ? "Création..." : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="flex-1 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}