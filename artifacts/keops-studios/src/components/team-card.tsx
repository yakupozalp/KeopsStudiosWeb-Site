import { TeamMember } from "@workspace/api-client-react";
import { Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-provider";

interface TeamCardProps {
  member: TeamMember;
  index?: number;
}

const THEMES = [
  { grad: "linear-gradient(135deg, hsl(258,90%,68%,0.25), hsl(318,85%,65%,0.15))", color: "hsl(258,90%,72%)", border: "hsl(258,90%,68%,0.4)", glow: "hsl(258,90%,68%,0.4)", social: "hsl(258,90%,72%)" },
  { grad: "linear-gradient(135deg, hsl(187,100%,50%,0.2), hsl(258,90%,68%,0.15))", color: "hsl(187,100%,55%)", border: "hsl(187,100%,50%,0.4)", glow: "hsl(187,100%,50%,0.4)", social: "hsl(187,100%,55%)" },
  { grad: "linear-gradient(135deg, hsl(318,85%,65%,0.2), hsl(38,92%,60%,0.15))", color: "hsl(318,85%,70%)", border: "hsl(318,85%,65%,0.4)", glow: "hsl(318,85%,65%,0.4)", social: "hsl(318,85%,70%)" },
  { grad: "linear-gradient(135deg, hsl(38,92%,60%,0.2), hsl(187,100%,50%,0.15))", color: "hsl(38,92%,65%)", border: "hsl(38,92%,60%,0.4)", glow: "hsl(38,92%,60%,0.4)", social: "hsl(38,92%,65%)" },
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export function TeamCard({ member, index = 0 }: TeamCardProps) {
  const theme = THEMES[index % THEMES.length];
  const hasImage = !!member.imageUrl?.trim();
  const { t } = useI18n();

  const displayRole = t(member.roleTr || member.role, member.roleEn || member.role);
  const displayBio = member.bioTr || member.bioEn
    ? t(member.bioTr || member.bio || "", member.bioEn || member.bio || "")
    : member.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-hover-shimmer group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer transition-all duration-300"
      style={{
        background: "hsl(var(--card))",
        border: `1px solid ${theme.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.15)`,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${theme.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)")}
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{ background: theme.grad.replace("135deg,", "90deg,").replace(/,0\.\d+\)/g, ")"), boxShadow: `0 0 10px ${theme.glow}` }} />

      {/* Avatar */}
      <div className="relative mx-auto mt-8 w-28 h-28 rounded-full overflow-hidden flex-shrink-0"
        style={{ border: `2px solid ${theme.border}`, boxShadow: `0 0 20px ${theme.glow}` }}>
        {hasImage ? (
          <img src={member.imageUrl!} alt={member.name}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-display font-black"
            style={{ background: theme.grad, color: theme.color }}>
            {getInitials(member.name)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col items-center text-center gap-2">
        <h4 className="text-lg font-display font-black tracking-tight">{member.name}</h4>
        <div className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: theme.color }}>
          {displayRole}
        </div>
        {displayBio && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-1">{displayBio}</p>
        )}

        {(member.twitterUrl || member.linkedinUrl) && (
          <div className="mt-auto pt-4 flex items-center justify-center gap-4 border-t w-full" style={{ borderColor: `${theme.border}` }}>
            {member.twitterUrl && (
              <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-125"
                style={{ color: "hsl(var(--muted-foreground))" }}
                onMouseEnter={e => (e.currentTarget.style.color = theme.social)}
                onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}>
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {member.linkedinUrl && (
              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="transition-all duration-200 hover:scale-125"
                style={{ color: "hsl(var(--muted-foreground))" }}
                onMouseEnter={e => (e.currentTarget.style.color = theme.social)}
                onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}>
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
