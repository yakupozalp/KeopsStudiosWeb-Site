import { Game } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface GameCardProps {
  game: Game;
}

const platformColors: Record<string, string> = {
  mobile: "bg-secondary/10 text-secondary border-secondary/30",
  pc: "bg-primary/10 text-primary border-primary/30",
  "mobile & pc": "bg-accent/10 text-accent border-accent/30",
};

const statusColors: Record<string, string> = {
  "in development": "bg-amber-500/10 text-amber-500 border-amber-500/30",
  released: "bg-green-500/10 text-green-500 border-green-500/30",
  "coming soon": "bg-primary/10 text-primary border-primary/30",
};

function getPlatformColor(platform: string) {
  return platformColors[platform.trim().toLowerCase()] ?? "bg-muted text-muted-foreground border-border";
}

function getStatusColor(status: string) {
  return statusColors[status.trim().toLowerCase()] ?? "bg-muted text-muted-foreground border-border";
}

export function GameCard({ game }: GameCardProps) {
  const { t } = useI18n();
  const hasImage = !!game.imageUrl && game.imageUrl.trim() !== "";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative flex flex-col border border-border bg-card/40 backdrop-blur-sm overflow-hidden h-full rounded-md shadow-2xl transition-all duration-500 hover:shadow-primary/10 hover:border-primary/50"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20" />

      <div className="aspect-[16/9] w-full relative overflow-hidden bg-background">
        {hasImage ? (
          <img
            src={game.imageUrl!}
            alt={game.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background via-card to-primary/10">
            <div className="css-pyramid scale-75" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

        <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end z-10">
          {game.platform.split(',').map((p) => (
            <span
              key={p.trim()}
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${getPlatformColor(p)}`}
            >
              {p.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-2xl font-black tracking-tight text-white">{game.title}</h4>
          {game.status && (
            <span className={`shrink-0 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${getStatusColor(game.status)}`}>
              {game.status}
            </span>
          )}
        </div>

        {game.genre && (
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <span className="text-xs text-primary font-mono tracking-widest uppercase">
              {game.genre}
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {game.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          {game.storeUrl ? (
            <a
              href={game.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
            >
              {t("Mağaza", "Store")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          ) : (
            <Link
              href={`/games`}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
            >
              {t("Detaylar", "Details")}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
