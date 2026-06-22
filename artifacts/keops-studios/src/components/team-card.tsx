import { TeamMember } from "@workspace/api-client-react";
import { Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const hasImage = !!member.imageUrl && member.imageUrl.trim() !== "";
  
  // Extract initials
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative flex flex-col items-center bg-card/30 backdrop-blur-sm border border-border hover:border-primary p-8 rounded-md shadow-xl transition-all duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md pointer-events-none" />
      
      <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden mb-6 border-2 border-border group-hover:border-primary transition-colors duration-500 shadow-2xl">
        {hasImage ? (
          <img
            src={member.imageUrl!}
            alt={member.name}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <span className="text-3xl font-display font-black text-primary">{initials}</span>
          </div>
        )}
      </div>

      <div className="text-center z-10 w-full flex flex-col flex-1">
        <h4 className="text-xl font-black tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
        <div className="text-xs text-primary font-mono uppercase tracking-widest mb-4 font-bold border border-primary/20 bg-primary/5 py-1 px-3 rounded-full self-center">
          {member.role}
        </div>

        {member.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
            {member.bio}
          </p>
        )}

        <div className="mt-auto flex items-center justify-center gap-4 w-full">
          {member.twitterUrl && (
            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
