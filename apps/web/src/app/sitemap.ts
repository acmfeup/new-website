import type { MetadataRoute } from "next";
import { getPastEvents } from "@/lib/events";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPastEvents();

  return [
    {
      url: "https://acmfeup.eu",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    { url: "https://acmfeup.eu/team" },
    { url: "https://acmfeup.eu/events" },
    ...events.map((event) => ({
      url: `https://acmfeup.eu/events/${event.slug}`,
    })),
  ];
}
