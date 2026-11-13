import events from "@/data/events.json";

export type Event = {
  id: number;
  slug: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  description: string;
  coverImage: string;
  speakers: string[];
  organisers: string[];
  links: { label: string; url: string }[];
};

export async function getEvents(): Promise<Event[]> {
  const orderedEvents = [...events];

  orderedEvents.sort((a, b) => {
    const dateA = Date.parse(a.startsAt);
    const dateB = Date.parse(b.startsAt);
    return dateB - dateA;
  });

  return orderedEvents;
}

export async function getPastEvents(): Promise<Event[]> {
  const events = await getEvents();
  const now = Date.now();

  return events.filter(
    (event) => Date.parse(event.endsAt ?? event.startsAt) <= now,
  );
}

export async function getEvent(slug: string): Promise<Event | undefined> {
  const events = await getPastEvents();
  return events.find((event) => event.slug === slug);
}
