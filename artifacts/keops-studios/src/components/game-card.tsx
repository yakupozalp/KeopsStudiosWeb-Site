import { Game } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { ExternalLink, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

interface GameCardProps {
  game: Game;
}

const CARD_THEMES = [
  { from: "hsl(258,90%,68%)", to: "hsl(318,85%,65%)", glow: "hsl(258,90%,68%,0.5)" },
  { from: "hsl(187,100%,50%)", to: "hsl(258,90%,68%)", glow: "hsl(187,100%,50%,0.5)" },
  { from: "hsl(318,85%,65%)", to: "hsl(38,92%,60%)", glow: "hsl(318,85%,65%,0.5)" },
];

let cardIndex = 0;

export function GameCard({ game }: GameCardProps) {
  const { t } = useI18n();
  const theme = CARD_THEMES[cardIndex++ % CARD_THEMES.length];
  const hasImage = !!game.imageUrl?.trim();

  const statusStyle = (() => {
    switch (game.status?.toLowerCase()) {
      case "released": return { bg: "hsl(142,70%,45%,0.15)", border: "hsl(142,70%,45%,0.4)", color: "hsl(142,70%,55%)" };
      case "coming soon": return { bg: "hsl(38,92%,60%,0.15)", border: "hsl(38,92%,60%,0.4)", color: "hsl(38,92%,65%)" };
      default: return { bg: "hsl(258,90%,68%,0.15)", border: "hsl(258,90%,68%,0.4)", color: "hsl(258,90%,72%)" };
    }
  })();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card-hover-shimmer group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: "hsl(var(--card))",
        border: `1px solid hsl(var(--card-border))`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${theme.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)")}
    >
      {/* Top gradient line animated on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${theme.from}, ${theme.to})`, boxShadow: `0 0 12px ${theme.glow}` }} />

      {/* Image area */}
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        {hasImage ? (
          <img src={game.imageUrl!} alt={game.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.from}20, ${theme.to}20)` }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full animate-pulse"
                style={{ background: `radial-gradient(circle, ${theme.from}30, transparent)` }} />
              <div className="css-pyramid opacity-60" style={{
                borderBottom: `80px solid ${theme.from}`,
                filter: `drop-shadow(0 0 20px ${theme.from})`
              }} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent opacity-80" />

        {/* Platform badges */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end z-10">
          {game.platform.split(',').map((p) => (
            <span key={p.trim()} className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm"
              style={{ background: `${theme.from}25`, border: `1px solid ${theme.from}50`, color: theme.from }}>
              {p.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xl font-display font-black tracking-tight leading-tight">{game.title}</h4>
          {game.status && (
            <span className="shrink-0 text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.color }}>
              {game.status}
            </span>
          )}
        </div>

        {game.genre && (
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono tracking-wider uppercase">{game.genre}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">{game.description}</p>

        {game.storeUrl && (
          <a href={game.storeUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mt-2 transition-all duration-200 hover:gap-3"
            style={{ color: theme.from }}>
            {t("Mağazaya Git", "Visit Store")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
