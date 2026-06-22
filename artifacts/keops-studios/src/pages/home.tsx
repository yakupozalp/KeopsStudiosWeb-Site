import { useGetSiteContent, useGetStats, useListGames, useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { GameCard } from "@/components/game-card";
import { TeamCard } from "@/components/team-card";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Gamepad2, Users, Calendar, Monitor, Mail, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setDisplay(Math.round((frame / total) * value));
      if (frame >= total) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{display}</span>;
}

const PARTICLES = [
  { x: "15%", y: "20%", size: 4, dur: "7s", delay: "0s", color: "hsl(258,90%,68%)" },
  { x: "80%", y: "15%", size: 6, dur: "9s", delay: "1s", color: "hsl(187,100%,50%)" },
  { x: "65%", y: "70%", size: 3, dur: "6s", delay: "2s", color: "hsl(318,85%,65%)" },
  { x: "25%", y: "75%", size: 5, dur: "11s", delay: "0.5s", color: "hsl(38,92%,60%)" },
  { x: "90%", y: "50%", size: 4, dur: "8s", delay: "3s", color: "hsl(258,90%,68%)" },
  { x: "10%", y: "55%", size: 7, dur: "12s", delay: "1.5s", color: "hsl(187,100%,50%)" },
  { x: "50%", y: "90%", size: 3, dur: "7s", delay: "4s", color: "hsl(318,85%,65%)" },
  { x: "40%", y: "10%", size: 5, dur: "10s", delay: "2.5s", color: "hsl(38,92%,60%)" },
];

const statItems = [
  { labelTr: "Oyun", labelEn: "Games", icon: Gamepad2, color: "hsl(258,90%,68%)", glow: "rgba(124,58,237,0.5)", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
  { labelTr: "Ekip Üyesi", labelEn: "Team Members", icon: Users, color: "hsl(187,100%,50%)", glow: "rgba(6,182,212,0.5)", bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.3)" },
  { labelTr: "Yıl Aktif", labelEn: "Years Active", icon: Calendar, color: "hsl(318,85%,65%)", glow: "rgba(236,72,153,0.5)", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.3)" },
  { labelTr: "Platform", labelEn: "Platforms", icon: Monitor, color: "hsl(38,92%,60%)", glow: "rgba(251,146,60,0.5)", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.3)" },
];

export default function Home() {
  const { t } = useI18n();
  const { data: content, isLoading: isContentLoading } = useGetSiteContent();
  const { data: stats, isLoading: isStatsLoading } = useGetStats();
  const { data: games = [], isLoading: isGamesLoading } = useListGames();
  const { data: team = [], isLoading: isTeamLoading } = useListTeamMembers();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const latestGames = [...games].sort((a, b) => a.order - b.order).slice(0, 3);
  const featuredTeam = [...team].sort((a, b) => a.order - b.order).slice(0, 4);

  const statValues = [
    stats?.gameCount ?? 0,
    stats?.teamSize ?? 0,
    stats?.yearsActive ?? 0,
    stats?.platforms?.length ?? 0,
  ];

  return (
    <PageTransition>
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0" />

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="orb-violet absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(258,90%,68%,0.35) 0%, transparent 70%)" }} />
          <div className="orb-cyan absolute bottom-[-10%] right-[-5%] w-[55vw] h-[55vw] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(187,100%,50%,0.25) 0%, transparent 70%)" }} />
          <div className="orb-pink absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle, hsl(318,85%,65%,0.2) 0%, transparent 70%)" }} />
          <div className="orb-gold absolute bottom-[20%] left-[15%] w-[35vw] h-[35vw] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, hsl(38,92%,60%,0.15) 0%, transparent 70%)" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div key={i} className="particle absolute rounded-full"
              style={{
                left: p.x, top: p.y,
                width: p.size, height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
                "--duration": p.dur,
                "--delay": p.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0" />

        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center mt-16">
          {/* Logo with glow ring */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 relative flex flex-col items-center float-1"
          >
            <div className="relative">
              <div className="absolute inset-[-20px] rounded-full opacity-50 spin-slow"
                style={{ background: "conic-gradient(from 0deg, hsl(258,90%,68%), hsl(187,100%,50%), hsl(318,85%,65%), hsl(38,92%,60%), hsl(258,90%,68%))", filter: "blur(20px)" }} />
              <Logo className="h-[140px] md:h-[200px] w-auto relative z-10 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 h-px w-64"
              style={{ background: "linear-gradient(90deg, transparent, hsl(258,90%,68%), hsl(187,100%,50%), hsl(318,85%,65%), transparent)", boxShadow: "0 0 12px hsl(258,90%,68%)" }}
            />
          </motion.div>

          {/* Hero title — animated gradient */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-text-animated text-5xl md:text-7xl lg:text-[6rem] font-display font-black mb-6 tracking-tighter max-w-5xl leading-[1.05]"
          >
            {isContentLoading ? <span className="opacity-0">Loading</span> : t(content?.heroTitleTr, content?.heroTitleEn, "BÜYÜK OYUNLAR İNŞA EDİYORUZ")}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-mono uppercase tracking-[0.2em]"
          >
            {isContentLoading ? <span className="opacity-0">—</span> : t(content?.heroSubtitleTr, content?.heroSubtitleEn, "Mobil ve PC için tutkuyla yapılan oyunlar")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-5"
          >
            <Link href="/games">
              <Button size="lg" className="animated-border h-14 px-10 font-mono uppercase tracking-widest text-white font-bold transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, hsl(258,90%,62%), hsl(318,85%,60%))", boxShadow: "0 0 30px hsl(258,90%,68%,0.4), 0 4px 20px rgba(0,0,0,0.3)" }}>
                <Sparkles className="mr-2 h-5 w-5" />
                {t("Oyunlarımız", "Our Games")}
              </Button>
            </Link>
            <Link href="/team">
              <Button size="lg" variant="outline" className="h-14 px-10 font-mono uppercase tracking-widest border-2 transition-all duration-300 hover:scale-105"
                style={{ borderColor: "hsl(187,100%,50%,0.5)", color: "hsl(187,100%,50%)" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 25px hsl(187,100%,50%,0.4), inset 0 0 25px hsl(187,100%,50%,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                {t("Stüdyo", "The Studio")}
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            className="absolute bottom-10 text-muted-foreground/60 animate-bounce">
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(258,90%,68%), hsl(318,85%,65%), transparent)" }} />

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1 }}
              className="md:col-span-5 flex items-center justify-center relative">
              <div className="text-[10rem] md:text-[16rem] font-display font-black select-none leading-none"
                style={{ WebkitTextStroke: "2px hsl(258,90%,68%,0.3)", color: "transparent" }}>2022</div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <span className="font-mono text-sm uppercase tracking-widest px-4 py-1.5 rounded-full font-bold"
                  style={{ background: "hsl(258,90%,68%,0.15)", border: "1px solid hsl(258,90%,68%,0.4)", color: "hsl(258,90%,72%)" }}>
                  Est. 2022
                </span>
                <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: "hsl(187,100%,50%,0.1)", border: "1px solid hsl(187,100%,50%,0.3)", color: "hsl(187,100%,55%)" }}>
                  {t("Bağımsız Stüdyo", "Indie Studio")}
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, delay: 0.2 }}
              className="md:col-span-7 pl-0 md:pl-12 py-6"
              style={{ borderLeft: "2px solid hsl(318,85%,65%,0.3)" }}>
              <h2 className="text-4xl md:text-5xl font-display font-black mb-8 uppercase"
                style={{ WebkitTextStroke: "1px hsl(318,85%,65%,0.6)", color: "transparent",
                  background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(318,85%,65%))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("Hakkımızda", "About Us")}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                {isContentLoading ? <span className="block h-32 bg-muted/20 rounded animate-pulse" /> :
                  t(content?.aboutTr, content?.aboutEn)}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(258,90%,68%,0.05) 0%, transparent 50%, hsl(187,100%,50%,0.05) 100%)" }} />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="card-hover-shimmer relative p-8 rounded-2xl flex flex-col items-center text-center cursor-default transition-all duration-300"
                style={{ background: s.bg, border: `1px solid ${s.border}`, boxShadow: `0 0 30px ${s.glow.replace("0.5", "0.15")}` }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 50px ${s.glow}, 0 10px 40px rgba(0,0,0,0.3)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 30px ${s.glow.replace("0.5", "0.15")}`)}>
                <s.icon className="h-8 w-8 mb-5" style={{ color: s.color, filter: `drop-shadow(0 0 8px ${s.color})` }} />
                <div className="text-5xl md:text-6xl font-display font-black mb-3 leading-none" style={{ color: s.color, textShadow: `0 0 20px ${s.color}` }}>
                  {isStatsLoading ? "—" : <AnimatedNumber value={statValues[i]} />}
                </div>
                <div className="text-xs font-mono tracking-widest uppercase font-bold text-muted-foreground">
                  {t(s.labelTr, s.labelEn)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ GAMES ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "hsl(258,90%,68%,0.08)" }} />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex-1">
              <p className="text-xs font-mono uppercase tracking-[0.4em] mb-3" style={{ color: "hsl(258,90%,72%)" }}>
                {t("Projeler", "Projects")}
              </p>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-5"
                style={{ background: "linear-gradient(135deg, hsl(var(--foreground)) 40%, hsl(258,90%,68%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("Oyunlarımız", "Our Games")}
              </h2>
              <div className="h-0.5 w-full relative overflow-hidden rounded-full">
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, hsl(258,90%,68%), hsl(318,85%,65%), hsl(187,100%,50%), transparent)" }} />
              </div>
            </motion.div>
            <Link href="/games" className="group shrink-0 flex items-center gap-3 font-mono text-sm uppercase tracking-widest font-bold transition-all"
              style={{ color: "hsl(258,90%,72%)" }}>
              {t("Tümünü Gör", "View All")}
              <span className="p-2 rounded-full transition-all duration-300 group-hover:scale-110"
                style={{ border: "1px solid hsl(258,90%,68%,0.4)", background: "hsl(258,90%,68%,0.1)" }}>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isGamesLoading
              ? Array(3).fill(0).map((_, i) => <div key={i} className="h-96 rounded-xl animate-pulse" style={{ background: "hsl(258,90%,68%,0.06)", border: "1px solid hsl(258,90%,68%,0.15)" }} />)
              : latestGames.length > 0
                ? latestGames.map((game) => <GameCard key={game.id} game={game} />)
                : (
                  <div className="col-span-3 py-24 text-center rounded-xl" style={{ border: "1px dashed hsl(258,90%,68%,0.3)", background: "hsl(258,90%,68%,0.04)" }}>
                    <div className="css-pyramid mx-auto mb-6" />
                    <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm">
                      {t("Yakında oyunlar gelecek.", "Games coming soon.")}
                    </p>
                  </div>
                )}
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, hsl(187,100%,50%,0.04) 50%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "hsl(187,100%,50%,0.07)" }} />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <p className="text-xs font-mono uppercase tracking-[0.4em] mb-3" style={{ color: "hsl(187,100%,55%)" }}>
                {t("Stüdyo", "Studio")}
              </p>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-5"
                style={{ background: "linear-gradient(135deg, hsl(var(--foreground)) 40%, hsl(187,100%,55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("Ekip", "The Team")}
              </h2>
              <div className="h-0.5 w-full relative overflow-hidden rounded-full" style={{ minWidth: "200px" }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, hsl(187,100%,50%), hsl(258,90%,68%), hsl(318,85%,65%), transparent)" }} />
              </div>
            </motion.div>
            <Link href="/team" className="group shrink-0 flex items-center gap-3 font-mono text-sm uppercase tracking-widest font-bold transition-all"
              style={{ color: "hsl(187,100%,55%)" }}>
              {t("Tümü", "All Members")}
              <span className="p-2 rounded-full transition-all duration-300 group-hover:scale-110"
                style={{ border: "1px solid hsl(187,100%,50%,0.4)", background: "hsl(187,100%,50%,0.1)" }}>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isTeamLoading
              ? Array(2).fill(0).map((_, i) => <div key={i} className="h-80 rounded-xl animate-pulse" style={{ background: "hsl(187,100%,50%,0.06)", border: "1px solid hsl(187,100%,50%,0.15)" }} />)
              : featuredTeam.map((member, i) => <TeamCard key={member.id} member={member} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(258,90%,68%,0.12) 0%, hsl(318,85%,65%,0.08) 50%, hsl(187,100%,50%,0.12) 100%)" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 animate-pulse"
          style={{ background: "radial-gradient(ellipse at center, hsl(318,85%,65%,0.1) 0%, transparent 70%)", animationDuration: "4s" }} />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-xs font-mono uppercase tracking-[0.4em] mb-6" style={{ color: "hsl(318,85%,65%)" }}>
              {t("İletişim", "Contact")}
            </p>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-10 gradient-text-animated">
              {t("Bir şeyler inşa etmeye hazır mısın?", "Ready to build something?")}
            </h2>
            {content?.email ? (
              <a href={`mailto:${content.email}`}>
                <Button size="lg" className="h-16 px-12 font-mono uppercase tracking-widest text-lg font-black transition-all duration-300 hover:scale-105 hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, hsl(258,90%,62%), hsl(318,85%,60%), hsl(187,100%,42%))", backgroundSize: "200%",
                    boxShadow: "0 0 40px hsl(318,85%,65%,0.5), 0 8px 30px rgba(0,0,0,0.4)", color: "white" }}>
                  <Mail className="mr-3 h-5 w-5" />
                  {t("İletişime Geç", "Get in Touch")}
                </Button>
              </a>
            ) : (
              <Button size="lg" className="h-16 px-12 font-mono uppercase tracking-widest font-black"
                style={{ background: "linear-gradient(135deg, hsl(258,90%,62%), hsl(318,85%,60%))", color: "white",
                  boxShadow: "0 0 40px hsl(318,85%,65%,0.4)" }}>
                {t("İletişime Geç", "Get in Touch")}
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
