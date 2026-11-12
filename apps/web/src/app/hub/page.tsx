import { ArrowUpRight, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getResources, getUpcomingEvents } from "@/lib/hub";

export default async function HubPage() {
  const [user, events, resources] = await Promise.all([
    getCurrentUser(),
    getUpcomingEvents(),
    getResources(),
  ]);

  return (
    <>
      <header className="mb-14 md:mb-20">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome, {user.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-md border border-border px-3 py-1">
            {user.department}
          </span>
          <span className="rounded-md border border-border px-3 py-1 capitalize">
            {user.role}
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href="/hub/profile">
              <Pencil aria-hidden="true" />
              Edit profile
            </Link>
          </Button>
        </div>
      </header>
      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <section aria-labelledby="events-heading">
          <h2 id="events-heading" className="mb-5 text-xl font-semibold">
            Next events
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {events.map((event) => {
              const date = new Date(`${event.date}T12:00:00`);
              return (
                <li key={event.title} className="flex items-center gap-5 py-5">
                  <time
                    dateTime={event.date}
                    className="w-12 shrink-0 text-center"
                  >
                    <span className="block text-xs uppercase tracking-wide">
                      {date.toLocaleDateString("en-GB", { month: "short" })}
                    </span>
                    <span className="block text-3xl font-medium tabular-nums">
                      {date.getDate()}
                    </span>
                  </time>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="mt-1 text-sm">
                      {date.toLocaleDateString("en-GB", { weekday: "short" })} ·{" "}
                      {event.time} · {event.location}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <section aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="mb-5 text-xl font-semibold">
            Quick links
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {resources.map((resource) => (
              <li key={resource.label}>
                <a
                  href={resource.href}
                  className="flex min-h-16 items-center justify-between gap-4 rounded-sm px-2 py-4 font-medium hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {resource.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
