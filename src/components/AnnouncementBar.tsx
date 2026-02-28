import { Gift } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs font-medium overflow-hidden h-8 flex items-center fixed top-0 left-0 right-0 z-[60]">
      <div
        style={{
          animation: "marquee 25s linear infinite",
          display: "flex",
          gap: "4rem",
          whiteSpace: "nowrap",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <Gift size={13} />
            Livraison gratuite dès votre première commande
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}