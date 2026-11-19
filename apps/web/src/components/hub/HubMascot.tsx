"use client";

/* AI WARNING: made with the help of AI! */

import { type CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./mascot.module.css";

type Phase = "enter" | "push" | "leave" | "goodbye";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useMascot(
  collapsed: boolean,
  setCollapsed: (collapsed: boolean) => void,
  onGoodbye: () => void,
) {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [opening, setOpening] = useState(false);
  const timeTakenToArrive = collapsed ? 200 : 1000;

  async function toggleSidebar() {
    setOpening(collapsed);
    setPhase("enter");
    await wait(timeTakenToArrive);
    setPhase("push");
    setCollapsed(!collapsed);
    await wait(1100);
    setPhase("leave");
    await wait(900);
    setPhase(null);
  }

  async function goodbye() {
    setPhase("goodbye");
    await wait(1800);
    onGoodbye();
  }

  return { phase, opening, timeTakenToArrive, toggleSidebar, goodbye };
}

export function HubMascot({
  phase,
  opening,
  timeTakenToArrive,
  collapsed,
}: {
  phase: Phase | null;
  opening: boolean;
  timeTakenToArrive: number;
  collapsed: boolean;
}) {
  if (!phase) return null;

  const left =
    phase === "goodbye" ? 24 : (collapsed ? 80 : 240) - (opening ? 100 : 20);
  const pose = {
    enter: "walkRight",
    push: opening ? "pushRight" : "push",
    leave: "walk",
    goodbye: "wave",
  }[phase];

  return (
    <div className={styles.scene}>
      <div
        className={cn(styles.actor, styles[phase])}
        style={
          {
            left,
            animationDuration:
              phase === "enter" ? `${timeTakenToArrive}ms` : undefined,
            "--entry-offset": `${-48 - left}px`,
          } as CSSProperties
        }
      >
        <span aria-hidden="true" className={cn(styles.sprite, styles[pose])} />
        {phase === "goodbye" && (
          <output className="absolute top-2 left-full rounded-xl rounded-bl-none border border-border bg-background px-4 py-3 text-base font-medium text-foreground">
            Goodbye!
          </output>
        )}
      </div>
    </div>
  );
}
