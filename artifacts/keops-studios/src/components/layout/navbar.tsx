import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n-provider";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/games", labelEn: "GAMES", labelTr: "OYUNLAR" },
    { href: "/team", labelEn: "TEAM", labelTr: "EKİP" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <Logo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
          <span className="font-display font-bold text-xl tracking-widest hidden sm:block">KEOPS</span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-6 mr-4 hidden md:flex">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative py-2">
                  <span className={`text-sm font-bold tracking-widest transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
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

          <div className="flex items-center gap-2 border-l border-border/40 pl-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
              className="w-9 h-9 text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              <span className="ml-2 text-xs font-bold">{language.toUpperCase()}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
