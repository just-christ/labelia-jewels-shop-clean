import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, Instagram } from "lucide-react";
import TikTokIcon from "@/components/TikTokIcon";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Nous contacter</DialogTitle>
          <DialogDescription>
            Contactez-nous par email ou suivez-nous sur nos réseaux sociaux
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Email */}
          <div className="text-center p-4 bg-secondary/50 rounded-sm">
            <Mail className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-display text-lg font-medium mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-3">labelia.civ@gmail.com</p>
            <a
              href="mailto:labelia.civ@gmail.com"
              className="inline-block px-4 py-2 text-sm bg-btn text-btn-foreground hover:bg-btn-hover rounded-sm transition-colors"
            >
              Envoyer un email
            </a>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-medium text-center mb-4">Suivez-nous</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/labelia_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-sm hover:from-pink-500/30 hover:to-purple-500/30 transition-colors"
              >
                <Instagram className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">@labelia_</span>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@labelia_225"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-4 bg-gradient-to-br from-black/10 to-gray-800/10 rounded-sm hover:from-black/20 hover:to-gray-800/20 transition-colors"
              >
                <TikTokIcon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">@labelia_225</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
