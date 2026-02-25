import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  firstOrderDate: string;
}

export default function AdminClients() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const data = await apiClient.getCustomers(token);
        setCustomers(data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Clients</h1>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : customers.length === 0 ? (
        <p className="text-muted-foreground">Aucun client enregistré.</p>
      ) : (
        <div className="border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-left">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Adresse</th>
                <th className="px-4 py-3 font-medium">Première commande</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={`${customer.email}-${index}`} className="border-t hover:bg-secondary/50">
                  <td className="px-4 py-3">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.address}</td>
                  <td className="px-4 py-3">{new Date(customer.firstOrderDate).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
