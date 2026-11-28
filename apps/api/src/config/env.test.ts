import { describe, expect, it } from "vitest";
import { isLocalDatabase } from "./env";

describe("isLocalDatabase", () => {
  it("accepts the docker-compose database", () => {
    expect(
      isLocalDatabase("postgresql://acmfeup:acmfeup@localhost:5432/acmfeup"),
    ).toBe(true);
    expect(isLocalDatabase("postgresql://u:p@127.0.0.1:5432/db")).toBe(true);
  });

  it("refuses anything else, such as Neon", () => {
    expect(
      isLocalDatabase("postgresql://u:p@ep-x.eu-central-1.aws.neon.tech/db"),
    ).toBe(false);
    expect(isLocalDatabase("postgresql://u:p@localhost.evil.com/db")).toBe(
      false,
    );
  });
});
