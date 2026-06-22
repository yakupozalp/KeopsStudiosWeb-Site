import { useI18n } from "@/lib/i18n-provider";
import { Link } from "wouter";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-card/50 border-t border-border/50 py-20 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-6 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Logo className="h-14 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-muted-foreground text-lg max-w-md">
              {t("Kalıcı izler bırakmak için inşa ediyoruz.", "Building to leave a lasting mark.")}
            </p>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest text-primary">{t("Keşfet", "Explore")}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/games" className="text-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm font-bold">
                  {t("Oyunlar", "Games")}
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm font-bold">
                  {t("Ekip", "Team")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-mono">
            © {new Date().getFullYear()} Keops Studios. {t("Tüm hakları saklıdır.", "All rights reserved.")}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground font-mono">Made with passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
