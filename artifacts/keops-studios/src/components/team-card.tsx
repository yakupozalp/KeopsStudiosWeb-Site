import { TeamMember } from "@workspace/api-client-react";
import { Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

interface TeamCardProps {
  member: TeamMember;
}

const memberColors = [
  { gradient: "from-primary/20 to-[hsl(318,80%,62%)]/20", role: "text-primary", border: "border-primary/30 hover:border-primary/60" },
  { gradient: "from-[hsl(189,90%,48%)]/20 to-primary/20", role: "text-[hsl(189,90%,55%)]", border: "border-[hsl(189,90%,48%)]/30 hover:border-[hsl(189,90%,48%)]/60" },
  { gradient: "from-[hsl(318,80%,62%)]/20 to-[hsl(38,92%,55%)]/20", role: "text-[hsl(318,80%,70%)]", border: "border-[hsl(318,80%,62%)]/30 hover:border-[hsl(318,80%,62%)]/60" },
  { gradient: "from-[hsl(38,92%,55%)]/20 to-[hsl(189,90%,48%)]/20", role: "text-[hsl(38,92%,60%)]", border: "border-[hsl(38,92%,55%)]/30 hover:border-[hsl(38,92%,55%)]/60" },
];

export function TeamCard({ member, index = 0 }: TeamCardProps & { index?: number }) {
  const colors = memberColors[index % memberColors.length];
  const hasImage = !!member.imageUrl && member.imageUrl.trim() !== "";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group border ${colors.border} bg-card overflow-hidden flex flex-col h-full rounded-xl shadow-lg transition-all duration-300`}
    >
      <div className={`aspect-[3/4] w-full relative bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
        {hasImage ? (
          <img
            src={member.imageUrl!}
            alt={member.name}
            className="object-cover w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo className="h-16 opacity-20" />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col items-center text-center">
        <h4 className="text-xl font-black tracking-tight mb-1">{member.name}</h4>
        <div className={`text-xs ${colors.role} font-mono uppercase tracking-widest mb-3 font-bold`}>
          {member.role}
        </div>

        {member.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
            {member.bio}
          </p>
        )}

        {(member.twitterUrl || member.linkedinUrl) && (
          <div className="mt-auto flex items-center justify-center gap-4 pt-4 w-full border-t border-border/40">
            {member.twitterUrl && (
              <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className={`text-muted-foreground ${colors.role.replace("text-", "hover:text-")} transition-colors`}>
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {member.linkedinUrl && (
              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`text-muted-foreground ${colors.role.replace("text-", "hover:text-")} transition-colors`}>
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
