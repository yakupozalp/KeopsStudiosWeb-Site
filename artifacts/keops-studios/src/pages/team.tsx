import { useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { TeamCard } from "@/components/team-card";

export default function Team() {
  const { t } = useI18n();
  const { data: team = [], isLoading } = useListTeamMembers();

  const sortedTeam = [...team].sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-16">
          <h1 className="text-sm font-mono text-primary tracking-[0.3em] mb-4 uppercase">
            {t("Geliştiriciler", "Developers")}
          </h1>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {t("Ekip", "Team")}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse border border-border" />
            ))}
          </div>
        ) : sortedTeam.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedTeam.map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-border/50 bg-card/10">
            <p className="text-muted-foreground font-mono uppercase tracking-widest">
              {t("Ekip bilgisi bulunamadı.", "No team information available.")}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
