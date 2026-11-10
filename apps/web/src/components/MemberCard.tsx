import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/initials";
import type { TeamMember } from "@/lib/team";

interface MemberCardProps {
  member: TeamMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const links = [
    { href: member.githubUrl, label: "GitHub", icon: Github },
    { href: member.linkedinUrl, label: "LinkedIn", icon: Linkedin },
  ];

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
          {links.map(
            ({ href, label, icon: Icon }) =>
              href && (
                <Button key={label} variant="ghost" size="icon" asChild>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${label}`}
                  >
                    <Icon aria-hidden />
                  </a>
                </Button>
              ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}
