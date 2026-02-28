import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const data = await apiClient.getOrders(token);
      setOrders(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return;

    try {
      await apiClient.updateOrderStatus(id, status, token);
      toast.success("Statut mis à jour !");
      fetchOrders();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const deleteOrder = async (id: string) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;

    try {
      await apiClient.deleteOrder(id, token);
      toast.success("Commande supprimée !");
      fetchOrders();
    } catch (error) {
      toast.error("Erreur lors de la suppression de la commande");
    }
  };

  const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    payée: "Payée",
    expédiée: "Expédiée",
  };

  const statusColors: Record<string, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    payée: "bg-green-100 text-green-800",
    expédiée: "bg-blue-100 text-blue-800",
  };

  const exportCSV = () => {
    const headers = ["ID", "Client", "Email", "Téléphone", "Adresse", "Total", "Statut", "Date"];
    const rows = orders.map((o) => [
      o.id, o.customerName, o.customerEmail, o.customerPhone, o.customerAddress, o.total, o.status, new Date(o.createdAt).toLocaleDateString("fr-FR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commandes-labelia.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Commandes</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-accent text-foreground rounded-sm transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">Aucune commande pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-sm">{order.customerName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{order.total} F CFA</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                    title="Supprimer la commande"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="px-4 pb-4 border-t bg-secondary/20">
                  <div className="grid grid-cols-2 gap-4 py-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Email</p>
                      <p>{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Téléphone</p>
                      <p>{order.customerPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">Adresse</p>
                      <p>{order.customerAddress}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs font-medium mb-2">Articles</p>
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span>{item.name} ({item.color}, {item.size}) × {item.quantity}</span>
                        <span>{item.price * item.quantity} F CFA</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs font-medium mb-2">Changer le statut</p>
                    <div className="flex gap-2">
                      {(["en_attente", "payée", "expédiée"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                            order.status === s
                              ? "bg-btn text-btn-foreground"
                              : "bg-secondary hover:bg-accent"
                          }`}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
