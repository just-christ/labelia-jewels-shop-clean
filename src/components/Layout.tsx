import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Phone, Instagram, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import ContactModal from "@/components/ContactModal";
import TikTokIcon from "@/components/TikTokIcon";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/produits", label: "Produits" },
  { to: "/a-propos", label: "À propos" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Labélia" 
              className="h-8 w-auto rounded-sm"
            />
            <span className="font-display text-2xl font-semibold tracking-wide text-foreground">
              Labélia
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setContactModalOpen(true)}
              className="relative p-2 text-primary hover:text-primary/80 transition-colors"
              aria-label="Nous contacter"
            >
              <Phone size={20} />
            </button>
            <Link to="/panier" className="relative p-2 hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-semibold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium py-2 ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="border-t bg-secondary/50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src="/logo.png" 
                  alt="Labélia" 
                  className="h-6 w-auto rounded-sm"
                />
                <h3 className="font-display text-xl font-semibold">Labélia</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Le luxe de dire je t'aime...
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Navigation</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Suivez-nous</h4>
              <div className="flex gap-4 mb-4">
                <a
                  href="https://instagram.com/labelia_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://tiktok.com/@labelia_225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon size={18} />
                </a>
                <a
                  href="mailto:labelia.civ@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
              <Link 
                to="/politique-confidentialite" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Labélia. Tous droits réservés.
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
    </div>
  );
}
