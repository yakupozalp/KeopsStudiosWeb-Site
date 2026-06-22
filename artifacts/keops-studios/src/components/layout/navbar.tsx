import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n-provider";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { href: "/games", tr: "Oyunlar", en: "Games" },
    { href: "/team", tr: "Ekip", en: "Team" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          background: scrolled ? "hsl(var(--background) / 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid hsl(var(--border) / 0.6)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:flex flex-col">
              <span className="font-display font-black text-base tracking-widest leading-none">KEOPS</span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase leading-none mt-0.5"
                style={{ color: "hsl(258,90%,72%)" }}>STUDIOS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative py-2 group">
                  <span className={`text-sm font-bold tracking-widest uppercase transition-colors duration-200 ${isActive ? "" : "text-muted-foreground group-hover:text-foreground"}`}
                    style={isActive ? { color: "hsl(258,90%,72%)" } : {}}>
                    {language === "tr" ? link.tr : link.en}
                  </span>
                  {isActive && (
                    <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, hsl(258,90%,68%), hsl(318,85%,65%))", boxShadow: "0 0 8px hsl(258,90%,68%,0.8)" }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle pill */}
            <button onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
              className="h-8 px-3 rounded-full font-mono text-xs font-black uppercase tracking-widest transition-all duration-200 hover:scale-105"
              style={{ background: "hsl(258,90%,68%,0.15)", border: "1px solid hsl(258,90%,68%,0.4)", color: "hsl(258,90%,72%)" }}>
              {language === "tr" ? "TR" : "EN"}
            </button>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile hamburger */}
            <Button variant="ghost" size="icon" className="md:hidden w-9 h-9"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "hsl(var(--background) / 0.97)", backdropFilter: "blur(24px)" }}>
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}>
                  <Link href={link.href} className="text-4xl font-display font-black uppercase tracking-tighter transition-colors duration-200"
                    style={{ color: location === link.href ? "hsl(258,90%,72%)" : "hsl(var(--foreground))" }}>
                    {language === "tr" ? link.tr : link.en}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
