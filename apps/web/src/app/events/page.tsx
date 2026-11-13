import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import { getPastEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Past Events | ACM FEUP",
  description: "Explore past events from ACM FEUP.",
};

export default async function EventsPage() {
  const events = await getPastEvents();

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center md:py-24">
          <h1 className="text-4xl font-bold text-balance md:text-5xl">
            Past Events
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90 text-pretty md:text-xl">
            Explore the talks, workshops, and activities we have hosted.
          </p>
        </div>
      </section>

      <section
        className="container mx-auto px-4 py-16"
        aria-label="Past events"
      >
        {events.length > 0 ? (
          <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No past events yet.
          </p>
        )}
      </section>
    </main>
  );
}
