import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("lets the later Tailwind class win when two conflict", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("skips falsy values so classes can be toggled inline", () => {
    const active = false;
    expect(cn("rounded", active && "bg-primary", undefined, null)).toBe(
      "rounded",
    );
  });
});
