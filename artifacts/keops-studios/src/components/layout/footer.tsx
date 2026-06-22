import { useGetSiteContent } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { Link } from "wouter";
import { Instagram, Twitter, Linkedin, Youtube, Mail } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const { data: content } = useGetSiteContent();
  const { t } = useI18n();

  return (
    <footer className="bg-background border-t border-border mt-24 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Logo className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              {t("Kalıcı izler bırakmak için inşa ediyoruz.", "Building to leave a lasting mark.")}
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest">{t("Keşfet", "Explore")}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm">
                  {t("Oyunlar", "Games")}
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider text-sm">
                  {t("Ekip", "Team")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest">{t("İletişim", "Connect")}</h4>
            <div className="flex flex-wrap gap-4">
              {content?.twitterUrl && (
                <a href={content.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {content?.instagramUrl && (
                <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {content?.linkedinUrl && (
                <a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {content?.youtubeUrl && (
                <a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {content?.discordUrl && (
                <a href={content.discordUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaDiscord className="h-5 w-5" />
                </a>
              )}
              {content?.email && (
                <a href={`mailto:${content.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Keops Studios. {t("Tüm hakları saklıdır.", "All rights reserved.")}
          </p>
          <Link href="/admin" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
