import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string; // Accept any string from database
}

export default function SizeGuideModal({ open, onOpenChange, category }: Props) {
  // Only show size guide for rings
  if (category !== 'bague') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Guide des tailles — Bagues</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img 
            src="/Images/Guide taille bague.jpg" 
            alt="Guide des tailles de bagues"
            className="w-full h-auto rounded-sm"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
