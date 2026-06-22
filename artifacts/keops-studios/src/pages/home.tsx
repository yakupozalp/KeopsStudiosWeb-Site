import { useGetSiteContent, useGetStats, useListGames, useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";
import { TeamCard } from "@/components/team-card";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Gamepad2, Users, Calendar, Monitor, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Helper for counting numbers
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{displayValue}</>;
}

export default function Home() {
  const { t } = useI18n();
  const { data: content, isLoading: isContentLoading } = useGetSiteContent();
  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const { data: games = [], isLoading: isGamesLoading } = useListGames();
  const { data: team = [], isLoading: isTeamLoading } = useListTeamMembers();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const latestGames = games.sort((a, b) => a.order - b.order).slice(0, 3);
  const featuredTeam = team.sort((a, b) => a.order - b.order).slice(0, 4);

  const statItems = [
    { label: t("Oyun", "Games"), value: stats?.gameCount ?? 0, icon: Gamepad2 },
    { label: t("Ekip Üyesi", "Team"), value: stats?.teamSize ?? 0, icon: Users },
    { label: t("Yıl Aktif", "Years Active"), value: stats?.yearsActive ?? 0, icon: Calendar },
    { label: t("Platform", "Platforms"), value: stats?.platforms?.length ?? 0, icon: Monitor },
  ];

  return (
    <PageTransition>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 bg-grid-pattern opacity-40" />
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="orb-1 absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px] mix-blend-screen" />
          <div className="orb-2 absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>
        
        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center mt-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-10 relative flex flex-col items-center"
          >
            <Logo className="h-[120px] md:h-[200px] w-auto relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-8 shadow-[0_0_10px_hsl(var(--primary))]" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-[6rem] font-display font-black mb-6 tracking-tighter text-white max-w-5xl leading-[1.1]"
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
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-mono uppercase tracking-[0.2em]"
          >
            {isContentLoading ? (
              <span className="opacity-0">Loading</span>
            ) : (
              t(content?.heroSubtitleTr, content?.heroSubtitleEn, "CRAFTING DIGITAL WORLDS")
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-14 flex flex-col sm:flex-row gap-6"
          >
            <Link href="/games">
              <Button size="lg" className="h-14 px-8 font-mono uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all">
                {t("Oyunlarımız", "Our Games")}
              </Button>
            </Link>
            <Link href="/team">
              <Button size="lg" variant="outline" className="h-14 px-8 font-mono uppercase tracking-widest border-primary/30 hover:border-primary hover:bg-primary/5">
                {t("Stüdyo", "The Studio")}
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 text-muted-foreground/50 animate-bounce"
          >
            <ChevronDown className="h-10 w-10" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="md:col-span-5 relative"
            >
              <div className="text-[12rem] md:text-[18rem] font-display font-black leading-none text-foreground/5 select-none text-stroke-primary">
                22
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-10 md:left-20">
                <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
                  {t("Hakkımızda", "About Us")}
                </h2>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="md:col-span-7 pl-0 md:pl-12 border-l-2 border-primary/20 py-8"
            >
              <div className="flex gap-4 mb-8">
                <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold uppercase tracking-widest">
                  Est. 2022
                </span>
                <span className="px-4 py-1.5 rounded-full border border-border bg-card/50 text-foreground font-mono text-xs font-bold uppercase tracking-widest">
                  {t("Bağımsız Studio", "Indie Studio")}
                </span>
              </div>
              
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-sans">
                {isContentLoading ? (
                  <span className="animate-pulse bg-muted/20 rounded h-32 w-full block" />
                ) : (
                  t(content?.aboutTr, content?.aboutEn)
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-card/20 border-y border-border/30 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="bg-background/40 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border/30">
              {statItems.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex flex-col items-center text-center pt-8 md:pt-0 first:pt-0"
                >
                  <stat.icon className="h-8 w-8 text-primary mb-6 opacity-80" />
                  <div className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter mb-4">
                    {isStatsLoading ? "-" : <AnimatedNumber value={stat.value} />}
                  </div>
                  <div className="text-sm font-mono tracking-widest text-muted-foreground uppercase font-bold">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section className="py-32 relative bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="flex-1 w-full relative">
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mb-6 uppercase">
                {t("Oyunlarımız", "Our Games")}
              </h2>
              <div className="h-px bg-border/50 w-full relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary to-transparent" />
              </div>
            </div>
            <Link href="/games" className="shrink-0 group flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase font-bold">
              {t("Tümünü Gör", "View All")} 
              <span className="p-2 rounded-full border border-border group-hover:border-primary transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isGamesLoading
              ? Array(3).fill(0).map((_, i) => <div key={i} className="h-96 bg-card/20 animate-pulse rounded-md border border-border/50" />)
              : latestGames.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-32 relative bg-card/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="flex-1 w-full relative">
              <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mb-6 uppercase">
                {t("Ekip", "The Team")}
              </h2>
              <div className="h-px bg-border/50 w-full relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-secondary to-transparent" />
              </div>
            </div>
            <Link href="/team" className="shrink-0 group flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground hover:text-secondary transition-colors uppercase font-bold">
              {t("Stüdyo", "Studio")} 
              <span className="p-2 rounded-full border border-border group-hover:border-secondary transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {featuredTeam.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {isTeamLoading
                ? Array(4).fill(0).map((_, i) => <div key={i} className="h-80 bg-card/20 animate-pulse border border-border/50 rounded-md" />)
                : featuredTeam.map((member) => <TeamCard key={member.id} member={member} />)}
            </div>
          ) : (
            <div className="py-24 text-center border border-border/30 bg-background/50 rounded-md backdrop-blur-sm">
              <p className="text-muted-foreground font-mono uppercase tracking-widest font-bold">
                {t("Yakında", "Coming Soon")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-8"
          >
            {t("Bir şeyler inşa etmeye hazır mısın?", "Ready to build something?")}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {content?.email ? (
              <a href={`mailto:${content.email}`}>
                <Button size="lg" className="h-14 px-10 font-mono uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <Mail className="mr-3 h-5 w-5" />
                  {t("İletişime Geç", "Get in touch")}
                </Button>
              </a>
            ) : (
              <Button size="lg" className="h-14 px-10 font-mono uppercase tracking-widest bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {t("İletişime Geç", "Get in touch")}
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
