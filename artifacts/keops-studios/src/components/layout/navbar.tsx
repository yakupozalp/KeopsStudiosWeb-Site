import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n-provider";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/games", labelEn: "GAMES", labelTr: "OYUNLAR" },
    { href: "/team", labelEn: "TEAM", labelTr: "EKİP" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-md"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            <span className="font-display font-bold text-xl tracking-widest hidden sm:block text-foreground">KEOPS STUDIOS</span>
          </Link>

          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 mr-4">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link key={link.href} href={link.href} className="relative py-2 group">
                    <span className={`text-sm font-bold tracking-widest transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {language === "en" ? link.labelEn : link.labelTr}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4 border-l border-border/40 pl-6">
              <button
                onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                className="text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors uppercase"
              >
                {language === "tr" ? "TR" : "EN"}
              </button>

              <div className="h-4 w-px bg-border/40 mx-2" />

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-8 w-8" />
            </Button>

            <div className="flex flex-col gap-8 items-center mt-12 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-3xl font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {language === "en" ? link.labelEn : link.labelTr}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 border-t border-border pt-8 mt-auto">
              <button
                onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                className="text-sm font-mono font-bold px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors uppercase"
              >
                {language === "tr" ? "TÜRKÇE" : "ENGLISH"}
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
