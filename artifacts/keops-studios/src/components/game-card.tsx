import { Game } from "@workspace/api-client-react";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n-provider";
import { ExternalLink, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

interface GameCardProps {
  game: Game;
}

const platformColors: Record<string, string> = {
  mobile: "bg-[hsl(189,90%,48%)]/20 text-[hsl(189,90%,55%)] border-[hsl(189,90%,48%)]/40",
  pc: "bg-primary/15 text-primary border-primary/40",
  "mobile & pc": "bg-[hsl(318,80%,62%)]/15 text-[hsl(318,80%,70%)] border-[hsl(318,80%,62%)]/40",
};

const statusColors: Record<string, string> = {
  "in development": "bg-[hsl(38,92%,55%)]/15 text-[hsl(38,92%,60%)] border-[hsl(38,92%,55%)]/40",
  released: "bg-[hsl(142,70%,45%)]/15 text-[hsl(142,70%,50%)] border-[hsl(142,70%,45%)]/40",
  "coming soon": "bg-primary/15 text-primary border-primary/40",
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
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col border border-border bg-card overflow-hidden h-full rounded-xl shadow-lg hover:shadow-primary/20 hover:border-primary/40 transition-shadow duration-500"
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-gradient-to-br from-card to-muted flex items-center justify-center">
        {hasImage ? (
          <img
            src={game.imageUrl!}
            alt={game.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-card to-[hsl(318,80%,62%)]/5">
            <Logo className="h-20 opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-[hsl(318,80%,62%)]/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-70" />

        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
          {game.platform.split(',').map((p) => (
            <span
              key={p.trim()}
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm ${getPlatformColor(p)}`}
            >
              {p.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xl font-black tracking-tight leading-tight">{game.title}</h4>
          {game.status && (
            <span className={`shrink-0 text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded-full border ${getStatusColor(game.status)}`}>
              {game.status}
            </span>
          )}
        </div>

        {game.genre && (
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
              {game.genre}
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
          {game.description}
        </p>

        {game.storeUrl && (
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors w-fit mt-1"
          >
            {t("Mağaza", "Store")}
            <ExternalLink className="h-3.5 w-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
