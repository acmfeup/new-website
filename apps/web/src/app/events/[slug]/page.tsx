import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getPastEvents } from "@/lib/events";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const events = await getPastEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return { title: "Event Not Found | ACM FEUP" };
  }

  return {
    title: `${event.title} | ACM FEUP`,
    description: event.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
        <header className="mx-auto max-w-4xl">
          <Link
            href="/events"
            className="inline-block rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Back to events
          </Link>
          <h1 className="mt-8 text-center text-4xl font-bold text-balance wrap-break-word md:text-5xl">
            {event.title}
          </h1>
        </header>

        <div className="relative mx-auto mt-8 h-[clamp(18rem,50vw,30rem)] w-full md:mt-10">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-contain"
            priority
          />
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-10">
          <section aria-labelledby="event-description" className="space-y-4">
            <h2
              id="event-description"
              className="text-2xl font-bold md:text-3xl"
            >
              About this event
            </h2>
            <p className="leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </section>

          {event.speakers.length > 0 && (
            <section aria-labelledby="event-speakers" className="space-y-4">
              <h2
                id="event-speakers"
                className="text-2xl font-bold md:text-3xl"
              >
                Speakers
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                {event.speakers.map((speaker) => (
                  <li key={speaker}>{speaker}</li>
                ))}
              </ul>
            </section>
          )}

          {event.organisers.length > 0 && (
            <section aria-labelledby="event-organisers" className="space-y-4">
              <h2
                id="event-organisers"
                className="text-2xl font-bold md:text-3xl"
              >
                Organisers
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                {event.organisers.map((organiser) => (
                  <li key={organiser}>{organiser}</li>
                ))}
              </ul>
            </section>
          )}

          {event.links.length > 0 && (
            <section aria-labelledby="event-links" className="space-y-4">
              <h2 id="event-links" className="text-2xl font-bold md:text-3xl">
                Links
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                {event.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} (opens in a new tab)`}
                      className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <dl className="flex flex-col items-center gap-4 border-t border-border pt-8 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10">
            <div className="space-y-1">
              <dt className="text-sm font-semibold text-muted-foreground">
                Started at
              </dt>
              <dd>
                <time dateTime={event.startsAt}>
                  {new Date(event.startsAt).toLocaleString("en-GB", {
                    dateStyle: "long",
                    timeStyle: "short",
                    timeZone: "Europe/Lisbon",
                  })}
                </time>
              </dd>
            </div>
            {event.endsAt && (
              <div className="space-y-1">
                <dt className="text-sm font-semibold text-muted-foreground">
                  Ended at
                </dt>
                <dd>
                  <time dateTime={event.endsAt}>
                    {new Date(event.endsAt).toLocaleString("en-GB", {
                      dateStyle: "long",
                      timeStyle: "short",
                      timeZone: "Europe/Lisbon",
                    })}
                  </time>
                </dd>
              </div>
            )}
            <div className="space-y-1">
              <dt className="text-sm font-semibold text-muted-foreground">
                Location
              </dt>
              <dd className="wrap-break-word">{event.location}</dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
