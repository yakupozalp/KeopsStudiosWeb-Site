import { useListGames } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";

export default function Games() {
  const { t } = useI18n();
  const { data: games = [], isLoading } = useListGames();

  const sortedGames = [...games].sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-16">
          <h1 className="text-sm font-mono text-primary tracking-[0.3em] mb-4 uppercase">
            {t("Katalog", "Catalog")}
          </h1>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {t("Oyunlar", "Games")}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-border/50 bg-card/10">
            <p className="text-muted-foreground font-mono uppercase tracking-widest">
              {t("Henüz oyun bulunmuyor.", "No games available yet.")}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
