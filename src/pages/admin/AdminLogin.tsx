import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { user, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (user && isAdmin) {
    // Rediriger vers la page demandée ou vers le dashboard par défaut
    const redirectUrl = sessionStorage.getItem('adminRedirectUrl') || '/admin/dashboard';
    sessionStorage.removeItem('adminRedirectUrl'); // Nettoyer après utilisation
    return <Navigate to={redirectUrl} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      // Connexion réussie - la redirection se fera automatiquement via le useEffect ci-dessus
      const redirectUrl = sessionStorage.getItem('adminRedirectUrl') || '/admin/dashboard';
      sessionStorage.removeItem('adminRedirectUrl');
      navigate(redirectUrl, { replace: true });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-center mb-2">Administration</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Labélia — Espace réservé</p>

        {user && !isAdmin && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-sm mb-4 text-center">
            Ce compte n'a pas les droits administrateur.
          </div>
        )}

        {sessionStorage.getItem('adminRedirectUrl') && (
          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-sm mb-4 text-center">
            Veuillez vous connecter pour accéder à la page demandée.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-sm px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-sm px-4 py-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover transition-colors rounded-sm disabled:opacity-50"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
