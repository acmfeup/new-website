"use client";

import { useEffect, useState } from "react";

// Each glyph is 7 rows, read top to bottom. In each row "1" is a lit dot, "0" is empty.
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  "1": ["00010", "00110", "01010", "00010", "00010", "00010", "00010"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
  // Blank digit, shown before the first tick so the layout doesn't jump
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

const ROWS = 7;
const GAP = 1; // empty columns between glyphs
const DOT_SIZE = 0.8; // share of each 1x1 cell the dot fills, the rest is spacing

// Column widths used to line the labels up under their digits
const DIGIT_COLS = GLYPHS["0"][0].length;
const PAIR_COLS = DIGIT_COLS + GAP + DIGIT_COLS;
const COLON_COLS = GAP + GLYPHS[":"][0].length + GAP;

// Places the glyphs left to right and returns the position of every lit dot
function layoutDots(text: string) {
  const dots: { x: number; y: number }[] = [];
  let offset = 0;

  for (const char of text) {
    const glyph = GLYPHS[char];
    for (const [y, row] of glyph.entries()) {
      for (const [x, cell] of [...row].entries()) {
        if (cell === "1") dots.push({ x: offset + x, y });
      }
    }
    offset += glyph[0].length + GAP;
  }

  return { dots, width: offset - GAP };
}

function DotMatrix({ text }: { text: string }) {
  const { dots, width } = layoutDots(text);
  const inset = (1 - DOT_SIZE) / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${ROWS}`}
      className="block h-auto w-full"
      aria-hidden="true"
    >
      {dots.map(({ x, y }) => (
        <rect
          key={`${x}-${y}`}
          x={x + inset}
          y={y + inset}
          width={DOT_SIZE}
          height={DOT_SIZE}
          rx={0.12}
          className="fill-primary-foreground"
        />
      ))}
    </svg>
  );
}

function splitTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return [
    // Only two digits fit, so anything past 99 days shows as 99
    { label: "Days", value: Math.min(99, Math.floor(seconds / 86400)) },
    { label: "Hours", value: Math.floor(seconds / 3600) % 24 },
    { label: "Minutes", value: Math.floor(seconds / 60) % 60 },
    { label: "Seconds", value: seconds % 60 },
  ];
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({
  target,
  onEnd,
}: {
  target: Date;
  onEnd?: () => void;
}) {
  // null until mounted so server and client render the same blank matrix
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      // Wake exactly when the next second rolls over, a plain 1s interval jitters and skips digits
      const untilNextSecond = (target.getTime() - current) % 1000;
      id = setTimeout(tick, untilNextSecond > 0 ? untilNextSecond : 1000);
    };
    tick();
    return () => clearTimeout(id);
  }, [target]);

  const remaining = now === null ? null : Math.max(0, target.getTime() - now);

  useEffect(() => {
    if (remaining === 0) onEnd?.();
  }, [remaining, onEnd]);

  if (remaining === 0) return null;

  const units = splitTime(remaining ?? 0);
  const text =
    remaining === null
      ? "  :  :  :  "
      : units.map((unit) => pad(unit.value)).join(":");
  const spoken = units
    .slice(0, 3)
    .map((unit) => `${unit.value} ${unit.label.toLowerCase()}`)
    .join(", ");

  return (
    <div
      role="timer"
      aria-label={
        remaining === null
          ? "Applications close soon"
          : `Applications close in ${spoken}`
      }
      className="mx-auto w-full max-w-xs sm:max-w-md"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary-foreground/80 sm:text-sm">
        Applications close in
      </p>

      <DotMatrix text={text} />

      {/* Same column proportions as the matrix, so each label sits under its digits */}
      <div
        className="mt-2 grid text-[10px] font-medium uppercase tracking-wider text-primary-foreground/60"
        style={{
          gridTemplateColumns: units
            .map(() => `${PAIR_COLS}fr`)
            .join(` ${COLON_COLS}fr `),
        }}
      >
        {units.map((unit, i) => (
          <span key={unit.label} style={{ gridColumn: i * 2 + 1 }}>
            {unit.label}
          </span>
        ))}
      </div>
    </div>
  );
}
