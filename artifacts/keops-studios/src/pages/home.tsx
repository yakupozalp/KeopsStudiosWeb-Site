import { useGetSiteContent, useGetStats, useListGames, useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";
import { TeamCard } from "@/components/team-card";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useI18n();
  const { data: content, isLoading: isContentLoading } = useGetSiteContent();
  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const { data: games = [], isLoading: isGamesLoading } = useListGames();
  const { data: team = [], isLoading: isTeamLoading } = useListTeamMembers();

  const latestGames = games.sort((a, b) => a.order - b.order).slice(0, 3);
  const featuredTeam = team.sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 pointer-events-none" />
        
        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Logo className="h-32 md:h-48 w-auto relative z-10 drop-shadow-2xl" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
          >
            {isContentLoading ? (
              <span className="opacity-0">Loading</span>
            ) : (
              t(content?.heroTitleTr, content?.heroTitleEn, "KEOPS STUDIOS")
            )}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-mono uppercase tracking-widest"
          >
            {isContentLoading ? (
              <span className="opacity-0">Loading</span>
            ) : (
              t(content?.heroSubtitleTr, content?.heroSubtitleEn, "KALICI İZLER BIRAKMAK İÇİN İNŞA EDİYORUZ")
            )}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-muted-foreground"
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm font-mono text-primary tracking-[0.3em] mb-6 uppercase">
              {t("Hakkımızda", "About Us")}
            </h2>
            <p className="text-2xl md:text-4xl leading-relaxed text-foreground/90 font-medium">
              {isContentLoading ? (
                <span className="animate-pulse bg-muted rounded h-8 w-full inline-block" />
              ) : (
                t(content?.aboutTr, content?.aboutEn)
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: t("Oyun", "Games"), value: stats?.gameCount || 0 },
              { label: t("Ekip Üyesi", "Team"), value: stats?.teamSize || 0 },
              { label: t("Yıl Aktif", "Years Active"), value: stats?.yearsActive || 0 },
              { label: t("Platform", "Platforms"), value: stats?.platforms?.length || 0 },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 border border-border/40 bg-card/20 backdrop-blur hover:border-primary/50 transition-colors duration-500">
                <div className="text-5xl md:text-7xl font-black text-foreground mb-4">
                  {isStatsLoading ? "-" : stat.value}
                </div>
                <div className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-mono text-primary tracking-[0.3em] mb-4 uppercase">
                {t("Projeler", "Projects")}
              </h2>
              <h3 className="text-4xl md:text-5xl font-black">{t("Son Oyunlar", "Latest Games")}</h3>
            </div>
            <Link href="/games" className="hidden md:inline-flex items-center gap-2 text-sm font-mono tracking-widest hover:text-primary transition-colors uppercase">
              {t("Tümünü Gör", "View All")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isGamesLoading
              ? Array(3).fill(0).map((_, i) => <div key={i} className="h-96 bg-muted animate-pulse border border-border" />)
              : latestGames.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/games">
              <Button variant="outline" className="w-full font-mono uppercase tracking-widest">
                {t("Tümünü Gör", "View All")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-primary tracking-[0.3em] mb-4 uppercase">
              {t("Stüdyo", "Studio")}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black">{t("Ekip", "The Team")}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {isTeamLoading
              ? Array(2).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse border border-border" />)
              : featuredTeam.map((member) => <TeamCard key={member.id} member={member} />)}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
