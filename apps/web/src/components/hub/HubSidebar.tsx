"use client";

import {
  CalendarDays,
  FolderOpen,
  House,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { HubRole } from "@/lib/hub";
import { cn } from "@/lib/utils";
import { HubMascot, useMascot } from "./HubMascot";

const sections = [
  { href: "/hub", label: "Home", icon: House },
  { href: "/hub/profile", label: "My profile", icon: UserRound },
  { href: "/hub/events", label: "Events", icon: CalendarDays, staffOnly: true },
  { href: "/hub/resources", label: "Resources", icon: FolderOpen },
];

const baseItemClass =
  "flex items-center gap-3 rounded-lg p-2.5 text-sm text-sidebar-foreground/70 hover:bg-background hover:text-sidebar-foreground disabled:opacity-50";

export default function HubSidebar({ role }: { role: HubRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const mascot = useMascot(collapsed, setCollapsed, () => router.push("/"));
  const isAnimating = mascot.phase !== null;
  const showLabels = !collapsed && mascot.phase !== "push";
  const labelClass = cn("sr-only", showLabels && "md:not-sr-only");
  const itemClass = cn(baseItemClass, collapsed && "md:justify-center");

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex items-center gap-2 border-b border-sidebar-border bg-sidebar p-3 text-sidebar-foreground md:h-screen md:flex-col md:items-stretch md:border-r md:border-b-0",
        "transition-[width] duration-1100 ease-linear",
        collapsed ? "md:w-16" : "md:w-60",
      )}
    >
      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 p-2 md:mb-6",
          collapsed && "md:justify-center",
        )}
      >
        <Image src="/acm_logo.png" alt="" width={36} height={36} />
        <span className={cn(labelClass, "font-semibold whitespace-nowrap")}>
          ACM FEUP Hub
        </span>
      </Link>
      <nav className="ml-auto flex gap-1 md:ml-0 md:flex-col">
        {sections
          .filter((section) => !(section.staffOnly && role === "member"))
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                itemClass,
                pathname === href &&
                  "bg-background font-medium text-sidebar-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className={labelClass}>{label}</span>
            </Link>
          ))}
      </nav>
      <div className="flex gap-1 md:mt-auto md:flex-col">
        <button
          type="button"
          disabled={isAnimating}
          onClick={mascot.goodbye}
          className={itemClass}
        >
          <LogOut className="size-5 shrink-0" />
          <span className={labelClass}>Log out</span>
        </button>
        <button
          type="button"
          disabled={isAnimating}
          onClick={mascot.toggleSidebar}
          className={cn(itemClass, "hidden md:flex")}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 shrink-0" />
          ) : (
            <PanelLeftClose className="size-5 shrink-0" />
          )}
          <span className={labelClass}>
            {collapsed ? "Expand" : "Collapse"}
          </span>
        </button>
      </div>
      <HubMascot {...mascot} collapsed={collapsed} />
    </aside>
  );
}
