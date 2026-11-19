import {
  FolderOpen,
  Github,
  Globe,
  Instagram,
  Link,
  Linkedin,
  type LucideIcon,
  Youtube,
} from "lucide-react";
import type { EventLink } from "@/lib/events";
import { cn } from "@/lib/utils";

const LINK_ICONS: Partial<Record<string, LucideIcon>> = {
  instagram: Instagram,
  drive: FolderOpen,
  website: Globe,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
};

interface EventExternalLinkProps {
  link: EventLink;
  className?: string;
}

export default function EventExternalLink({
  link,
  className,
}: EventExternalLinkProps) {
  const Icon = LINK_ICONS[link.type] ?? Link;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.label} (opens in a new tab)`}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{link.label}</span>
    </a>
  );
}
