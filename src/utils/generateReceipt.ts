// npm install jspdf  (si pas déjà installé)
import jsPDF from "jspdf";

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  color: string;
  size: string;
  quantity: number;
}

interface ReceiptData {
  orderNumber: string;       // ex: "000001"
  date: string;              // ex: "01/03/2026"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;          // montant en FCFA (0 si pas de promo)
  discountLabel?: string;    // ex: "-10%"
  total: number;
}

export function generateReceipt(data: ReceiptData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const marginX = 20;
  const lineW = W - marginX * 2;
  let y = 20;

  // ── Helpers ─────────────────────────────────────────────────────────────
  const separator = () => {
    doc.setDrawColor(180, 160, 120);
    doc.setLineWidth(0.4);
    doc.line(marginX, y, W - marginX, y);
    y += 6;
  };

  const text = (
    str: string,
    x: number,
    size = 10,
    style: "normal" | "bold" | "italic" = "normal",
    align: "left" | "center" | "right" = "left",
    color: [number, number, number] = [30, 30, 30]
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    doc.text(str, x, y, { align });
  };

  const nl = (n = 6) => { y += n; };

  // ── EN-TÊTE ──────────────────────────────────────────────────────────────
  // Bloc logo texte
  text("LABELIA", W / 2, 22, "bold", "center", [20, 20, 20]);
  nl(8);
  text("Bijoux en Acier Inoxydable", W / 2, 9, "italic", "center", [120, 100, 60]);
  nl(8);
  separator();

  text("REÇU OFFICIEL", W / 2, 13, "bold", "center", [20, 20, 20]);
  nl(7);
  text(`Commande n° ${data.orderNumber}`, W / 2, 10, "normal", "center", [80, 80, 80]);
  nl(5);
  text(`Date : ${data.date}`, W / 2, 10, "normal", "center", [80, 80, 80]);
  nl(5);

  // Badge statut
  doc.setFillColor(34, 139, 34);
  doc.roundedRect(marginX + lineW / 2 - 25, y - 3, 50, 7, 2, 2, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Commande validée", W / 2, y + 2, { align: "center" });
  y += 10;
  separator();

  // ── CLIENT ───────────────────────────────────────────────────────────────
  text("CLIENT", marginX, 10, "bold", "left", [120, 100, 60]);
  nl(6);
  text(data.customerName, marginX, 11, "bold");
  nl(6);
  text(data.customerEmail, marginX, 10);
  nl(5);
  text(data.customerPhone, marginX, 10);
  nl(5);
  text(data.customerAddress, marginX, 10);
  nl(7);
  separator();

  // ── DÉTAIL DES BIJOUX ────────────────────────────────────────────────────
  text("DÉTAIL DES BIJOUX", marginX, 10, "bold", "left", [120, 100, 60]);
  nl(7);

  // En-têtes colonnes
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("Bijou", marginX, y);
  doc.text("Qté", 140, y, { align: "center" });
  doc.text("Prix", W - marginX, y, { align: "right" });
  nl(5);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(marginX, y, W - marginX, y);
  nl(5);

  data.items.forEach((item) => {
    const label = `${item.product.name} — ${item.color} · T.${item.size}`;
    const lineTotal = item.product.price * item.quantity;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(label, marginX, y);
    doc.text(`${item.quantity}`, 140, y, { align: "center" });
    doc.text(`${lineTotal.toLocaleString("fr-FR", { useGrouping: false })} FCFA`, W - marginX, y, { align: "right" });
    nl(6);
  });

  nl(2);
  separator();

  // ── RÉCAPITULATIF ────────────────────────────────────────────────────────
  text("RÉCAPITULATIF", marginX, 10, "bold", "left", [120, 100, 60]);
  nl(7);

  const row = (label: string, value: string, bold = false, color: [number,number,number] = [30,30,30]) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    // Points de remplissage
    const dots = "·".repeat(50);
    doc.text(label, marginX, y);
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.text(dots, marginX + 45, y);
    doc.setFontSize(10);
    doc.setTextColor(...color);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(value, W - marginX, y, { align: "right" });
    nl(6);
  };

  row("Sous-total", `${data.subtotal.toLocaleString("fr-FR", { useGrouping: false })} FCFA`);

  if (data.discount > 0) {
    row(
      `Réduction ${data.discountLabel || ""}`,
      `-${data.discount.toLocaleString("fr-FR", { useGrouping: false })} FCFA`,
      false,
      [180, 60, 60]
    );
  }

  row("Livraison", "Offerte", false, [34, 139, 34]);
  nl(2);

  // Total
  doc.setFillColor(245, 240, 230);
  doc.roundedRect(marginX, y - 4, lineW, 12, 2, 2, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("TOTAL PAYÉ :", marginX + 4, y + 4);
  doc.text(`${data.total.toLocaleString("fr-FR", { useGrouping: false })} FCFA`, W - marginX - 4, y + 4, { align: "right" });
  y += 16;
  separator();

  // ── PAIEMENT ─────────────────────────────────────────────────────────────
  text("PAIEMENT", marginX, 10, "bold", "left", [120, 100, 60]);
  nl(6);
  text("À la livraison", marginX, 10);
  nl(7);
  separator();

  // ── MESSAGE LABELIA ──────────────────────────────────────────────────────
  text("MESSAGE LABELIA", marginX, 10, "bold", "left", [120, 100, 60]);
  nl(7);

  const message = [
    "Merci pour votre confiance.",
    "Chaque bijou Labelia est préparé avec soin, élégance et délicatesse.",
    "Nous espérons illuminer vos moments précieux.",
    "Nous vous contacterons pour une prise en charge 🖤",
  ];

  message.forEach((line) => {
    text(line, marginX, 10, "italic", "left", [80, 80, 80]);
    nl(6);
  });

  nl(4);
  separator();

  // Pied de page
  text("labelia-jewel.com  ·  contact@labelia.fr", W / 2, 8, "normal", "center", [160, 140, 100]);

  // ── TÉLÉCHARGEMENT ───────────────────────────────────────────────────────
  doc.save(`Recu_Labelia_${data.orderNumber}.pdf`);
}
