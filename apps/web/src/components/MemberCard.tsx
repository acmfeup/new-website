import {
  Github,
  Globe,
  Instagram,
  Link,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/initials";
import type { TeamMember } from "@/lib/team";

// Partial: a type the backend adds later falls back to a generic link
// instead of breaking the page.
const LINK_TYPES: Partial<Record<string, { label: string; icon: LucideIcon }>> =
  {
    github: { label: "GitHub", icon: Github },
    linkedin: { label: "LinkedIn", icon: Linkedin },
    instagram: { label: "Instagram", icon: Instagram },
    website: { label: "Website", icon: Globe },
  };

interface MemberCardProps {
  member: TeamMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="h-full border-border hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex h-full flex-col items-center gap-4 text-center">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt=""
            width={128}
            height={128}
            className="size-32 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex size-32 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary"
          >
            {getInitials(member.name)}
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-card-foreground wrap-break-word">
            {member.name}
          </h3>
          <p className="text-sm text-muted-foreground wrap-break-word">
            {member.role}
          </p>
        </div>

        <div className="mt-auto flex gap-2">
          {member.links.map((link) => {
            const { label, icon: Icon } = LINK_TYPES[link.type] ?? {
              label: link.type,
              icon: Link,
            };

            return (
              <Button key={link.url} variant="ghost" size="icon" asChild>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${label} (opens in a new tab)`}
                >
                  <Icon aria-hidden />
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
