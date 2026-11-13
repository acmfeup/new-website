import Image from "next/image";
import { cn } from "@/lib/utils";

interface EventCoverProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function EventCover({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: EventCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-60 blur-2xl"
      />
      <div className="absolute inset-0 bg-background/30" aria-hidden="true" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
