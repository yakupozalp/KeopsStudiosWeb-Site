import { useGetSiteContent, useGetStats, useListGames, useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";
import { TeamCard } from "@/components/team-card";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Gamepad2, Users, Calendar, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useI18n();
  const { data: content, isLoading: isContentLoading } = useGetSiteContent();
  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const { data: games = [], isLoading: isGamesLoading } = useListGames();
  const { data: team = [], isLoading: isTeamLoading } = useListTeamMembers();

  const latestGames = games.sort((a, b) => a.order - b.order).slice(0, 3);
  const featuredTeam = team.sort((a, b) => a.order - b.order);

  const statItems = [
    { label: t("Oyun", "Games"), value: stats?.gameCount ?? 0, icon: Gamepad2, color: "text-primary", bg: "bg-primary/10 dark:bg-primary/15", border: "border-primary/30" },
    { label: t("Ekip Üyesi", "Team"), value: stats?.teamSize ?? 0, icon: Users, color: "text-[hsl(189,90%,48%)]", bg: "bg-[hsl(189,90%,48%)]/10", border: "border-[hsl(189,90%,48%)]/30" },
    { label: t("Yıl Aktif", "Years Active"), value: stats?.yearsActive ?? 0, icon: Calendar, color: "text-[hsl(318,80%,62%)]", bg: "bg-[hsl(318,80%,62%)]/10", border: "border-[hsl(318,80%,62%)]/30" },
    { label: t("Platform", "Platforms"), value: stats?.platforms?.length ?? 0, icon: Monitor, color: "text-[hsl(38,92%,55%)]", bg: "bg-[hsl(38,92%,55%)]/10", border: "border-[hsl(38,92%,55%)]/30" },
  ];

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(318,80%,62%)]/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-[hsl(189,90%,48%)]/10 rounded-full blur-[80px]" />
        </div>
        
        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
            <Logo className="h-32 md:h-48 w-auto relative z-10 drop-shadow-2xl" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-primary via-[hsl(318,80%,65%)] to-[hsl(189,90%,55%)] bg-clip-text text-transparent"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex gap-4"
          >
            <Link href="/games">
              <Button size="lg" className="font-mono uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30">
                {t("Oyunlar", "Games")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/team">
              <Button size="lg" variant="outline" className="font-mono uppercase tracking-widest border-primary/40 hover:border-primary hover:text-primary">
                {t("Ekip", "Team")}
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-10 animate-bounce text-muted-foreground"
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(318,80%,62%)]/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-sm font-mono text-primary tracking-[0.3em] mb-6 uppercase">
              {t("Hakkımızda", "About Us")}
            </h2>
            <p className="text-2xl md:text-3xl leading-relaxed text-foreground/90 font-medium">
              {isContentLoading ? (
                <span className="animate-pulse bg-muted rounded h-8 w-full inline-block" />
              ) : (
                t(content?.aboutTr, content?.aboutEn)
              )}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`text-center p-8 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur transition-all duration-300 hover:scale-105`}
              >
                <stat.icon className={`h-7 w-7 ${stat.color} mx-auto mb-4`} />
                <div className={`text-5xl md:text-6xl font-black ${stat.color} mb-3`}>
                  {isStatsLoading ? "-" : stat.value}
                </div>
                <div className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-mono text-primary tracking-[0.3em] mb-4 uppercase">
                {t("Projeler", "Projects")}
              </h2>
              <h3 className="text-4xl md:text-5xl font-black">{t("Son Oyunlar", "Latest Games")}</h3>
            </div>
            <Link href="/games" className="hidden md:inline-flex items-center gap-2 text-sm font-mono tracking-widest text-primary hover:text-primary/80 transition-colors uppercase font-bold">
              {t("Tümünü Gör", "View All")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isGamesLoading
              ? Array(3).fill(0).map((_, i) => <div key={i} className="h-96 bg-muted animate-pulse rounded-xl border border-border" />)
              : latestGames.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/games">
              <Button variant="outline" className="w-full font-mono uppercase tracking-widest border-primary/40 hover:border-primary hover:text-primary">
                {t("Tümünü Gör", "View All")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(318,80%,62%)]/5 via-transparent to-[hsl(189,90%,48%)]/5 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-[hsl(318,80%,62%)] tracking-[0.3em] mb-4 uppercase">
              {t("Stüdyo", "Studio")}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black">{t("Ekip", "The Team")}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {isTeamLoading
              ? Array(2).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse border border-border rounded-xl" />)
              : featuredTeam.map((member, i) => <TeamCard key={member.id} member={member} index={i} />)}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
