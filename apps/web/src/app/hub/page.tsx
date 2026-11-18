import Image from "next/image";
import Link from "next/link";
import { getCurrentUser, getUpcomingEvents } from "@/lib/hub";
import { cn } from "@/lib/utils";

const quickLinks = [
  {
    href: "https://app.notion.com/p/FEUP-DASHBOARD-21f4e7de2d2380ab8b5ceff7dcaf4fc9",
    logo: "/hub/notion.svg",
    label: "Notion",
  },
  {
    href: "https://drive.google.com/",
    logo: "/hub/drive.svg",
    label: "Google Drive",
    iconOnly: true,
  },
  {
    href: "https://mail.google.com/",
    logo: "/hub/gmail.svg",
    label: "Gmail",
    iconOnly: true,
  },
  {
    href: "https://www.instagram.com/acmfeup/",
    logo: "/hub/instagram.svg",
    label: "Instagram",
  },
];

export default async function HubPage() {
  const [user, events] = await Promise.all([
    getCurrentUser(),
    getUpcomingEvents(),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col justify-center md:min-h-[calc(100svh-8rem)]">
      <header className="mb-12 text-center md:mb-16">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Welcome,{" "}
          <Link
            href="/hub/profile"
            className="underline decoration-1 underline-offset-8 hover:decoration-2"
          >
            {user.name}
          </Link>
        </h1>
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm capitalize">
          {[user.department, user.role].map((chipVal) => (
            <span
              key={chipVal}
              className="rounded-md border border-border px-3 py-1.5"
            >
              {chipVal}
            </span>
          ))}
        </div>
      </header>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-6">
        <section id="next-events">
          <h2 className="mb-5 text-xl font-semibold">Next events</h2>
          <ul className="space-y-3">
            {events.map((event) => {
              const date = new Date(`${event.date}T12:00:00`);
              return (
                <li key={event.id} className="flex gap-3">
                  <time
                    dateTime={event.date}
                    className="flex w-20 flex-col items-center justify-center rounded-md border border-border py-3"
                  >
                    <span className="text-sm">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-3xl font-medium tabular-nums">
                      {date.getDate()}
                    </span>
                  </time>
                  <div className="flex min-h-24 flex-1 flex-col justify-center rounded-md border border-border px-4 py-3">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="mt-2 text-sm">
                      {date.toLocaleDateString("en-US", { weekday: "short" })} ·{" "}
                      {event.time} · {event.location}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <section id="quick-links">
          <h2 className="mb-5 text-xl font-semibold">Quick links</h2>
          <ul className="grid grid-cols-2 gap-3">
            {quickLinks.map(({ href, logo, label, iconOnly }) => (
              <li key={href} className={cn(!iconOnly && "col-span-2")}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-24 items-center justify-center gap-4 rounded-md border border-border px-4 py-3 font-medium hover:bg-card"
                >
                  <Image
                    src={logo}
                    alt={label + "'s logo"}
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                  <span className={cn(iconOnly && "sr-only")}>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
