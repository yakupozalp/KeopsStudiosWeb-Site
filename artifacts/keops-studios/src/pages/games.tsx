import { useListGames } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

export default function Games() {
  const { t } = useI18n();
  const { data: games = [], isLoading } = useListGames();

  const sortedGames = [...games].sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[15vw] leading-none md:text-[12rem] font-display font-black text-transparent text-stroke-primary opacity-20 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              GAMES
            </h1>
            <h2 className="text-sm font-mono text-primary tracking-[0.4em] mb-6 uppercase font-bold relative">
              {t("Katalog", "Catalog")}
            </h2>
            <h3 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter text-foreground relative">
              {t("Oyunlar", "Games")}
            </h3>
          </motion.div>
        </div>
      </section>

      {/* FILTER / CONTENT */}
      <section className="py-20 bg-card/10 min-h-[50vh] border-t border-border/30">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex justify-center mb-16">
            <div className="flex gap-4 p-2 bg-background/50 backdrop-blur-md border border-border/50 rounded-full">
              <button className="px-6 py-2 rounded-full bg-primary/20 text-primary font-mono text-sm font-bold uppercase tracking-widest">
                {t("Tümü", "All")}
              </button>
              <button className="px-6 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-mono text-sm font-bold uppercase tracking-widest transition-colors">
                Mobile
              </button>
              <button className="px-6 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-mono text-sm font-bold uppercase tracking-widest transition-colors">
                PC
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[450px] bg-card/20 animate-pulse border border-border/50 rounded-md" />
              ))}
            </div>
          ) : sortedGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center border border-border/30 bg-background/50 backdrop-blur-sm rounded-md shadow-2xl">
              <div className="css-pyramid scale-75 mb-10 opacity-50" />
              <h4 className="text-2xl font-display font-black text-foreground mb-4 tracking-tight">
                {t("Yeni Dünyalar İnşa Ediliyor", "Building New Worlds")}
              </h4>
              <p className="text-muted-foreground font-mono uppercase tracking-widest max-w-md mx-auto">
                {t("Şu an geliştirme aşamasındayız. Çok yakında ilk projelerimizi duyuracağız.", "We are currently in development. We will announce our first projects very soon.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
