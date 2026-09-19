"use client";

import {
  CircleAlert,
  CircleCheck,
  CircleMinus,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Check = "checking" | "up" | "down" | "unknown";

type Status = { api: Check; db: Check; error?: string };

const STATES: Record<
  Check,
  { label: string; icon: LucideIcon; className: string }
> = {
  checking: {
    label: "Checking",
    icon: LoaderCircle,
    className: "text-foreground/60",
  },
  up: { label: "Connected", icon: CircleCheck, className: "text-primary" },
  down: {
    label: "Unreachable",
    icon: CircleAlert,
    className: "text-destructive",
  },
  unknown: {
    label: "Unknown",
    icon: CircleMinus,
    className: "text-foreground/60",
  },
};

// This is the pattern for calling the API from the browser: the base URL
// comes from NEXT_PUBLIC_API_URL, and the request goes through CORS.
async function fetchHealth(): Promise<Status> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    // A 503 is the API saying the db is down. Any other error status (a 404
    // from a wrong URL, a 500) means we did not get a health answer at all.
    if (!res.ok && res.status !== 503) {
      return { api: "down", db: "unknown", error: `HTTP ${res.status}` };
    }
    const body: { db?: string } = await res.json();
    return { api: "up", db: body.db === "up" ? "up" : "down" };
  } catch (error) {
    // No usable answer at all: API down, wrong URL, or CORS blocked it.
    return { api: "down", db: "unknown", error: (error as Error).message };
  }
}

export default function StatusCheck() {
  const [status, setStatus] = useState<Status>({
    api: "checking",
    db: "checking",
  });

  const check = useCallback(async () => {
    setStatus({ api: "checking", db: "checking" });
    setStatus(await fetchHealth());
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">System status</CardTitle>
        <CardDescription className="text-foreground/60">
          Checks whether the platform API and its database are reachable.
        </CardDescription>
      </CardHeader>

      <CardContent aria-live="polite">
        <ul className="divide-y rounded-lg border bg-background">
          <StatusRow label="API" check={status.api} />
          <StatusRow label="Database" check={status.db} />
        </ul>
        {status.error && (
          <p className="mt-4 text-sm text-destructive wrap-break-word">
            Could not reach the API: {status.error}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-between gap-4">
        <span className="min-w-0 truncate font-mono text-xs text-foreground/60">
          {API_URL}/health
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={check}
          disabled={status.api === "checking"}
        >
          Check again
        </Button>
      </CardFooter>
    </Card>
  );
}

function StatusRow({ label, check }: { label: string; check: Check }) {
  const { label: stateLabel, icon: Icon, className } = STATES[check];

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="font-medium">{label}</span>
      <span className={cn("flex items-center gap-2 text-sm", className)}>
        <Icon
          aria-hidden
          className={cn("size-4", check === "checking" && "animate-spin")}
        />
        {stateLabel}
      </span>
    </li>
  );
}
