"use client";

import { CalendarDays, FolderOpen, House, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HubRole } from "@/lib/hub";
import { cn } from "@/lib/utils";

const sections = [
  { href: "/hub", label: "Home", icon: House },
  { href: "/hub/profile", label: "My profile", icon: UserRound },
  { href: "/hub/events", label: "Events", icon: CalendarDays },
  { href: "/hub/resources", label: "Resources", icon: FolderOpen },
];

export default function HubSidebar({ role }: { role: HubRole }) {
  const pathname = usePathname();

  return (
    <aside className="flow-root border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <Link
        href="/"
        aria-label="ACM FEUP website"
        className="m-4 flex w-fit items-center gap-3 rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sidebar-primary md:m-6"
      >
        <Image src="/acm_logo.png" alt="" width={44} height={44} />
        <span className="font-semibold tracking-tight">ACM FEUP</span>
      </Link>
      <nav
        aria-label="Hub"
        className="grid grid-cols-2 gap-1 px-4 pb-4 md:grid-cols-1"
      >
        {sections
          .filter(
            (section) => section.href !== "/hub/events" || role !== "member",
          )
          .map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/hub" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-primary",
                  active &&
                    "bg-sidebar-primary text-sidebar-primary-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
      </nav>
      <p className="hidden px-7 pb-6 text-xs md:mt-auto md:block">Team hub</p>
    </aside>
  );
}
