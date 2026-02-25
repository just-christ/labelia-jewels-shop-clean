import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté OU n'est pas admin → rediriger vers login
  // On sauvegarde la destination pour rediriger après connexion
  if (!user || !isAdmin) {
    // Stocker l'URL demandée pour la redirection après connexion
    sessionStorage.setItem('adminRedirectUrl', location.pathname + location.search);
    return <Navigate to="/admin/login" replace />;
  }

  // Si tout est bon → afficher le contenu
  return <>{children}</>;
}
