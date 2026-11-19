import Link from "next/link";
import EventCover from "@/components/EventCover";
import EventExternalLink from "@/components/EventExternalLink";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/events";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="relative h-full gap-0 overflow-hidden border-border py-0">
      <EventCover
        src={event.coverImage}
        alt={event.title}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
        className="aspect-video"
      />

      <CardContent className="flex flex-1 flex-col gap-4 py-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-card-foreground wrap-break-word">
            <Link
              href={`/events/${event.slug}`}
              className="rounded-sm after:absolute after:inset-0 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {event.title}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground wrap-break-word">
            {event.location}
          </p>
          <time
            dateTime={event.startsAt}
            className="block text-sm text-muted-foreground"
          >
            {new Date(event.startsAt).toLocaleDateString("en-GB", {
              timeZone: "Europe/Lisbon",
            })}
          </time>
        </div>

        {event.links.length > 0 && (
          <ul className="relative z-10 mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
            {event.links.map((link) => (
              <li key={link.url}>
                <EventExternalLink
                  link={link}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
