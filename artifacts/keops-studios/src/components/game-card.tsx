import { Game } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n-provider";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { t } = useI18n();

  const hasImage = !!game.imageUrl && game.imageUrl.trim() !== "";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative flex flex-col border border-border bg-card overflow-hidden h-full"
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-black flex items-center justify-center border-b border-border">
        {hasImage ? (
          <img
            src={game.imageUrl!}
            alt={game.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <Logo className="h-24 opacity-10 grayscale" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {game.platform.split(',').map((p) => (
            <Badge key={p.trim()} variant="secondary" className="font-mono uppercase text-[10px] tracking-wider px-2 py-0 border-border bg-background/80 backdrop-blur">
              {p.trim()}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2 flex items-center gap-3">
          <h4 className="text-2xl font-black tracking-tight">{game.title}</h4>
          {game.status && (
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase px-2 py-0.5 border border-primary/30">
              {game.status}
            </span>
          )}
        </div>
        
        {game.genre && (
          <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-4">
            {game.genre}
          </div>
        )}
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
          {game.description}
        </p>

        {game.storeUrl && (
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors w-fit group/btn"
          >
            {t("Mağaza", "Store")}
            <ExternalLink className="h-4 w-4 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
