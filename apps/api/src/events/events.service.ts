import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { events } from "../db/schema";

@Injectable()
export class EventsService {
  async findBySlug(slug: string) {
    const [event] = await db
      .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        startsAt: events.startsAt,
        endsAt: events.endsAt,
        location: events.location,
        description: events.description,
        coverImage: events.coverImage,
        speakers: events.speakers,
        organisers: events.organisers,
        links: events.links,
      })
      .from(events)
      .where(eq(events.slug, slug));

    return event;
  }
}
