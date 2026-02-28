import { Gift } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground text-xs font-medium overflow-hidden h-8 flex items-center fixed top-0 left-0 right-0 z-50">
      <div
        className="whitespace-nowrap flex items-center"
        style={{
          animation: "marquee 25s linear infinite",
          display: "flex",
          gap: "4rem",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-2 shrink-0">
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