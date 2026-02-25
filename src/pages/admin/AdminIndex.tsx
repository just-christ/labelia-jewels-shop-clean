import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminIndex() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  // Si l'utilisateur est connecté mais n'est pas admin, rediriger vers login
  if (user && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si l'utilisateur est connecté ET est admin, rediriger vers le dashboard
  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Par défaut, rediriger vers le login
  return <Navigate to="/admin/login" replace />;
}
