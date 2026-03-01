import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Package, ShoppingCart, Users, LogOut, LayoutDashboard, Menu, X, Tag } from "lucide-react";
import { useState } from "react";

const adminLinks = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/promotions", label: "Promotions", icon: Tag },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      await signOut();
      window.location.href = "/admin/login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sidebar fixe sur desktop, drawer sur mobile ── */}
      <>
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-60 border-r bg-card flex flex-col
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold">Admin</h2>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-secondary"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${
                  location.pathname === link.to
                    ? "bg-btn text-btn-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </aside>
      </>

      {/* ── Zone principale : marge gauche UNIQUEMENT sur desktop ── */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-card border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-secondary"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-semibold text-sm">Labelia Admin</span>
        </header>

        {/* Contenu */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}