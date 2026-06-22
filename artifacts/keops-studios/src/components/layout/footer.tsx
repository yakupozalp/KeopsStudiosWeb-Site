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
    <footer className="bg-card/50 border-t border-border/50 py-20 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-5 lg:col-span-6 flex flex-col gap-6">
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

          <div className="col-span-1 md:col-span-4 lg:col-span-4">
            <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-widest text-primary">{t("İletişim", "Connect")}</h4>
            <div className="flex flex-wrap gap-4">
              {content?.twitterUrl && (
                <a href={content.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {content?.instagramUrl && (
                <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-[#E1306C] hover:text-[#E1306C] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {content?.linkedinUrl && (
                <a href={content.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-[#0077B5] hover:text-[#0077B5] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {content?.youtubeUrl && (
                <a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-[#FF0000] hover:text-[#FF0000] transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {content?.discordUrl && (
                <a href={content.discordUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-background border border-border hover:border-[#5865F2] hover:text-[#5865F2] transition-colors">
                  <FaDiscord className="h-5 w-5" />
                </a>
              )}
              {content?.email && (
                <a href={`mailto:${content.email}`} className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
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
