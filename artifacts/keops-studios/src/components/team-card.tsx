import { TeamMember } from "@workspace/api-client-react";
import { Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const hasImage = !!member.imageUrl && member.imageUrl.trim() !== "";

  return (
    <div className="group border border-border bg-card overflow-hidden flex flex-col h-full">
      <div className="aspect-[3/4] w-full relative bg-zinc-950 border-b border-border overflow-hidden">
        {hasImage ? (
          <img
            src={member.imageUrl!}
            alt={member.name}
            className="object-cover w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo className="h-16 opacity-10" />
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col items-center text-center">
        <h4 className="text-xl font-black tracking-tight mb-1">{member.name}</h4>
        <div className="text-xs text-primary font-mono uppercase tracking-widest mb-4">
          {member.role}
        </div>
        
        {member.bio && (
          <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
            {member.bio}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-center gap-4 pt-4 w-full border-t border-border/40">
          {member.twitterUrl && (
            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
