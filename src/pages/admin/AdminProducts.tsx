import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, X, Check, ChevronDown, ChevronUp, Image as ImageIcon, Star } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isBestSeller: boolean;
  bestSellerOrder?: number | null;
  images: Record<string, string[]>;
  packagingImage?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helper URL ────────────────────────────────────────────────────────────
function getImageUrl(img: string): string {
  if (!img) return "";
  return img.startsWith("http") ? img : `/Images/${img}`;
}

// ─── Images disponibles - Collection DIAMOND UNIVERS ─────────────────────────
const AVAILABLE_IMAGES: string[] = [
  "packaging.png",
  "JH0A9575.jpg",
  "JH0A9678.jpg",
  "JH0A9690.jpg",
  "JH0A9831.jpg",
  "JH0A3163_3.jpg",
  "JH0A3163_4.jpg",
  "JH0A3163_2.jpg",
  "JH0A3163.jpg",
  "JH0A9850.jpg",
  "JH0A0631.jpg",
  "JH0A0060.jpg",
  "JH0A0055.jpg",
  "JH0A8027.jpg",
  "JH0A8027_2.jpg",
  "image_4.jpg",
  "image_2.jpg",
  "JH0A1768.jpg",
  "JH0A1768_1.jpg",
  "JH0A1768_2.jpg",
  "JH0A1768_3.jpg",
  "579A6473.jpg",
  "115A9447.jpg",
  "2X5A8099.jpg",
  "IMG_2084.jpg",
  "IMG_2113.jpg",
  "IMG_2123.jpg",
  "Guide taille bague.jpg",
];

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  promoPrice: null as number | null,
  category: "bague",
  sizes: [] as string[],
  colors: ["argent"] as string[],
  stock: 0,
  isBestSeller: false,
  bestSellerOrder: null as number | null,
  images: { argent: [], doré: [] } as Record<string, string[]>,
  packagingImage: "",
  videoUrl: "",
};

// ─── Sélecteur multi-images ────────────────────────────────────────────────
function ImagePicker({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: string[];
  onChange: (images: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (img: string) => {
    onChange(selected.includes(img) ? selected.filter((i) => i !== img) : [...selected, img]);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <ImageIcon size={15} />
          {label}
          {selected.length > 0 && (
            <span className="bg-btn text-btn-foreground text-xs px-2 py-0.5 rounded-full">
              {selected.length} sélectionnée{selected.length > 1 ? "s" : ""}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {selected.length > 0 && (
        <div className="flex gap-2 p-2 flex-wrap border-t bg-secondary/10">
          {selected.map((img) => (
            <div key={img} className="relative group">
              <img
                src={getImageUrl(img)}
                alt={img}
                className="w-14 h-14 object-cover rounded-md border-2 border-btn"
              />
              <button
                type="button"
                onClick={() => toggle(img)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="p-2 border-t">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto">
            {AVAILABLE_IMAGES.map((img) => {
              const isSelected = selected.includes(img);
              return (
                <button
                  key={img}
                  type="button"
                  onClick={() => toggle(img)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all ${
                    isSelected ? "border-btn scale-95" : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={img}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect fill='%23eee' width='60' height='60'/><text x='50%' y='55%' text-anchor='middle' font-size='8' fill='%23999'>?</text></svg>";
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-btn/30 flex items-center justify-center">
                      <Check size={16} className="text-white drop-shadow" />
                    </div>
                  )}
                  <p className="text-[9px] text-center truncate px-0.5 py-0.5 bg-black/40 text-white absolute bottom-0 left-0 right-0">
                    {img.split(".")[0].slice(0, 10)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sélecteur image unique (packaging) ───────────────────────────────────
function SingleImagePicker({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: string;
  onChange: (img: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <ImageIcon size={15} />
          {label}
          {selected && (
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">{selected}</span>
          )}
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {selected && (
        <div className="flex items-center gap-3 p-2 border-t bg-secondary/10">
          <img
            src={getImageUrl(selected)}
            alt={selected}
            className="w-14 h-14 object-cover rounded-md border-2 border-btn"
          />
          <button type="button" onClick={() => onChange("")} className="text-xs text-destructive hover:underline">
            Retirer
          </button>
        </div>
      )}

      {open && (
        <div className="p-2 border-t">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto">
            {AVAILABLE_IMAGES.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => { onChange(img); setOpen(false); }}
                className={`relative rounded-md overflow-hidden border-2 transition-all ${
                  selected === img ? "border-btn scale-95" : "border-transparent hover:border-muted-foreground/40"
                }`}
              >
                <img
                  src={getImageUrl(img)}
                  alt={img}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect fill='%23eee' width='60' height='60'/></svg>";
                  }}
                />
                {selected === img && (
                  <div className="absolute inset-0 bg-btn/30 flex items-center justify-center">
                    <Check size={16} className="text-white drop-shadow" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [sizesInput, setSizesInput] = useState("");
  const { user } = useAuth();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch {
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      await apiClient.deleteProduct(id, token);
      toast.success("Produit supprimé !");
      fetchProducts();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setSizesInput("");
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      promoPrice: p.promoPrice || null,
      category: p.category,
      sizes: p.sizes,
      colors: p.colors,
      stock: p.stock,
      isBestSeller: p.isBestSeller || false,
      bestSellerOrder: p.bestSellerOrder || null,
      images: p.images || { argent: [], doré: [] },
      packagingImage: p.packagingImage || "",
      videoUrl: p.videoUrl || "",
    });
    setSizesInput(p.sizes.join(", "));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;
    // Tailles uniquement pour les bagues
    const sizes = form.category === "bague"
      ? sizesInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const payload = { ...form, sizes };
    try {
      if (editing) {
        await apiClient.updateProduct(editing.id, payload, token);
        toast.success("Produit mis à jour !");
      } else {
        await apiClient.createProduct(payload, token);
        toast.success("Produit créé !");
      }
      setDialogOpen(false);
      fetchProducts();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const getFirstImage = (p: Product): string | null => {
    for (const color of Object.keys(p.images || {})) {
      const imgs = p.images[color];
      if (imgs && imgs.length > 0) return getImageUrl(imgs[0]);
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Produits</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg"
        >
          <Plus size={16} />
          Ajouter un produit
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border rounded-xl">
          <ImageIcon size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun produit. Créez-en un !</p>
        </div>
      ) : (
        <>
          {/* Cartes mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3">
            {products.map((p) => {
              const img = getFirstImage(p);
              return (
                <div key={p.id} className="border rounded-xl p-3 bg-card flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                    {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-muted-foreground/40" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      {p.isBestSeller && (
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                    <div className="mt-0.5">
                      {p.promoPrice ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground line-through">{p.price.toLocaleString()} F</span>
                          <span className="text-sm font-semibold text-red-600">{p.promoPrice.toLocaleString()} F</span>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold">{p.price.toLocaleString()} F CFA</p>
                      )}
                      {p.stock === 0 && (
                        <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                          Rupture de stock
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="p-2 hover:text-primary transition-colors rounded-lg hover:bg-secondary"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-destructive transition-colors rounded-lg hover:bg-secondary"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tableau desktop */}
          <div className="hidden lg:block bg-card border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 text-left border-b">
                  <th className="px-4 py-3 text-sm font-medium">Image</th>
                  <th className="px-4 py-3 text-sm font-medium">Nom</th>
                  <th className="px-4 py-3 text-sm font-medium">Catégorie</th>
                  <th className="px-4 py-3 text-sm font-medium">Prix</th>
                  <th className="px-4 py-3 text-sm font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const img = getFirstImage(p);
                  return (
                    <tr key={p.id} className="border-t hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                          {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground/40" /></div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-sm">
                        <div className="flex items-center gap-2">
                          {p.name}
                          {p.isBestSeller && (
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{p.category}</td>
                      <td className="px-4 py-3 text-sm">
                        {p.promoPrice ? (
                          <div>
                            <span className="text-muted-foreground line-through text-xs">{p.price.toLocaleString()} F</span>
                            <span className="ml-1.5 text-red-600 font-semibold">{p.promoPrice.toLocaleString()} F</span>
                          </div>
                        ) : (
                          <span>{p.price.toLocaleString()} F CFA</span>
                        )}
                        {p.stock === 0 && (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Rupture de stock
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:text-primary rounded hover:bg-secondary transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:text-destructive rounded hover:bg-secondary transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Modal ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editing ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium mb-1">Nom du produit</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ex: Bague Lumina"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              />
            </div>

            {/* Prix + Prix promo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Prix (F CFA)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prix promo <span className="text-muted-foreground font-normal text-xs">(optionnel)</span>
                </label>
                <input
                  type="number"
                  value={form.promoPrice || ""}
                  onChange={(e) => setForm({ ...form, promoPrice: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Laisser vide si aucune promo"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, sizes: [] })}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="bague">Bagues</option>
                <option value="chaîne">Chaînes</option>
                <option value="bracelet">Bracelets</option>
              </select>
            </div>

            {/* Tailles — uniquement pour les bagues */}
            {form.category === "bague" && (
              <div>
                <label className="block text-sm font-medium mb-1">Tailles (séparées par des virgules)</label>
                <input
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="ex: 50, 52, 54, 56"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
            )}

            {/* Couleurs */}
            <div>
              <label className="block text-sm font-medium mb-2">Couleurs disponibles</label>
              <div className="flex gap-4">
                {["argent", "doré"].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.colors.includes(c)}
                      onChange={(e) => {
                        const colors = e.target.checked
                          ? [...form.colors, c]
                          : form.colors.filter((x) => x !== c);
                        setForm({ ...form, colors });
                      }}
                    />
                    <span className="capitalize">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images — apparaît uniquement si la couleur est cochée */}
            {form.colors.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium">Images du produit</label>
                {form.colors.map((color) => (
                  <div key={color} className="space-y-2 border rounded-lg p-3 bg-secondary/10">
                    <p className="text-sm font-medium capitalize">
                      Couleur — <span className="text-primary">{color}</span>
                    </p>

                    {/* Sélection depuis collection existante */}
                    <ImagePicker
                      label={`Images existantes — ${color}`}
                      selected={(form.images[color] || []).filter(i => !i.startsWith("http"))}
                      onChange={(imgs) => {
                        const cloudinary = (form.images[color] || []).filter(i => i.startsWith("http"));
                        setForm({ ...form, images: { ...form.images, [color]: [...imgs, ...cloudinary] } });
                      }}
                    />

                    {/* Upload Cloudinary */}
                    <ImageUpload
                      initialImages={[]}
                      onImagesChange={(imgs) => {
                        const local = (form.images[color] || []).filter(i => !i.startsWith("http"));
                        const cloudinary = imgs.filter(i => i.startsWith("http"));
                        setForm({ ...form, images: { ...form.images, [color]: [...local, ...cloudinary] } });
                      }}
                      maxImages={5}
                      label={`Uploader images — ${color}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Packaging */}
            <div>
              <label className="block text-sm font-medium mb-2">Image packaging</label>
              <SingleImagePicker
                label="Choisir l'image packaging"
                selected={form.packagingImage || ""}
                onChange={(img) => setForm({ ...form, packagingImage: img })}
              />
            </div>

            {/* Vidéo */}
            <div>
              <label className="block text-sm font-medium mb-1">
                URL vidéo <span className="text-muted-foreground font-normal text-xs">(optionnel)</span>
              </label>
              <input
                type="url"
                value={form.videoUrl || ""}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={form.stock || 0}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                placeholder="0"
                min="0"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* 🌟 Best Seller */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBestSeller || false}
                  onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked, bestSellerOrder: e.target.checked ? (form.bestSellerOrder || 1) : null })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500" />
                  Best Seller
                </span>
              </label>
              {form.isBestSeller && (
                <div className="mt-2">
                  <label className="block text-xs text-muted-foreground mb-1">Ordre d'affichage (1 = premier)</label>
                  <input
                    type="number"
                    value={form.bestSellerOrder || 1}
                    onChange={(e) => setForm({ ...form, bestSellerOrder: Number(e.target.value) })}
                    placeholder="1"
                    min="1"
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 text-sm font-medium tracking-wider uppercase bg-btn text-btn-foreground hover:bg-btn-hover rounded-lg transition-colors"
            >
              {editing ? "Enregistrer les modifications" : "Créer le produit"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}