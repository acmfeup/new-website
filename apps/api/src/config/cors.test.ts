import { describe, expect, it } from "vitest";
import { parseCorsOrigins } from "./cors";

describe("parseCorsOrigins", () => {
  it("falls back to the local web app when unset or empty", () => {
    expect(parseCorsOrigins(undefined)).toEqual(["http://localhost:3000"]);
    expect(parseCorsOrigins("")).toEqual(["http://localhost:3000"]);
    expect(parseCorsOrigins(" , ")).toEqual(["http://localhost:3000"]);
  });

  it("splits a comma separated list and trims each origin", () => {
    expect(
      parseCorsOrigins("https://acmfeup.eu, http://localhost:3000 "),
    ).toEqual(["https://acmfeup.eu", "http://localhost:3000"]);
  });

  it("drops empty entries left by stray commas", () => {
    expect(parseCorsOrigins("https://acmfeup.eu,,")).toEqual([
      "https://acmfeup.eu",
    ]);
  });
});
