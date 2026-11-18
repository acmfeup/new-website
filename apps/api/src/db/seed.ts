import { db, pool } from "./client";
import { events } from "./schema";

// ponytail: structure only, there is no reference data to seed yet. Import
// `db` from ./client and put the inserts in here, keeping them idempotent so
// this can run twice.
async function seed() {
  await db.delete(events);

  await db.insert(events).values([
    {
      slug: "spring-community-meetup",
      title: "Spring Community Meetup",
      startsAt: new Date("2026-04-10T17:00:00.000Z"),
      endsAt: new Date("2026-04-10T19:30:00.000Z"),
      location: "Main Auditorium, Porto",
      description: "An evening of lightning talks and community networking.",
      coverImage: "https://example.com",
      speakers: ["Ana Silva", "Carlos Mendes"],
      organisers: ["Community Team"],
      photos: ["https://example.com"],
      links: [
        {
          label: "Event Page",
          url: "https://example.com",
        },
      ],
    },
    {
      slug: "summer-typescript-workshop",
      title: "Summer TypeScript Workshop",
      startsAt: new Date("2026-06-15T14:00:00.000Z"),
      endsAt: null,
      location: "Online",
      description: "Hands-on session covering Drizzle ORM and NestJS.",
      coverImage: null,
      speakers: ["Sofia Costa"],
      organisers: ["Tech Guild"],
      photos: [],
      links: [],
    },
  ]);

  console.log("seed: ensured 2 events exist");
}
seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
