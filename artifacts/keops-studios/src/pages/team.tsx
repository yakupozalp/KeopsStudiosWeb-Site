import { useListTeamMembers } from "@workspace/api-client-react";
import { useI18n } from "@/lib/i18n-provider";
import { PageTransition } from "@/components/layout/page-transition";
import { TeamCard } from "@/components/team-card";
import { motion } from "framer-motion";

export default function Team() {
  const { t } = useI18n();
  const { data: team = [], isLoading } = useListTeamMembers();

  const sortedTeam = [...team].sort((a, b) => a.order - b.order);

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[15vw] leading-none md:text-[12rem] font-display font-black text-transparent text-stroke-primary opacity-20 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              STUDIO
            </h1>
            <h2 className="text-sm font-mono text-secondary tracking-[0.4em] mb-6 uppercase font-bold relative">
              {t("Geliştiriciler", "Creators")}
            </h2>
            <h3 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter text-foreground relative">
              {t("Ekip", "Team")}
            </h3>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-card/10 min-h-[50vh] border-t border-border/30">
        <div className="container mx-auto px-4 max-w-7xl">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-96 bg-card/20 animate-pulse border border-border/50 rounded-md" />
              ))}
            </div>
          ) : sortedTeam.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedTeam.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TeamCard member={member} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center border border-border/30 bg-background/50 backdrop-blur-sm rounded-md shadow-2xl">
              <p className="text-muted-foreground font-mono uppercase tracking-widest font-bold">
                {t("Ekip bilgisi bulunamadı.", "No team information available.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
