import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { afterEach, describe, expect, it, vi } from "vitest";
import { auth } from "./auth";
import { AuthGuard, AuthSession } from "./auth.guard";

function contextFor(req: object) {
  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as ExecutionContext;
}

describe("AuthGuard", () => {
  afterEach(() => vi.restoreAllMocks());

  it("rejects a request without a session", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(null);
    const req = { headers: {} };

    await expect(new AuthGuard().canActivate(contextFor(req))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("puts the session's user on the request", async () => {
    const result = {
      user: { id: "u1", email: "ana@acmfeup.eu" },
      session: { id: "s1", userId: "u1" },
    } as AuthSession;
    vi.spyOn(auth.api, "getSession").mockResolvedValue(result);
    const req = { headers: { cookie: "x" } };

    await expect(new AuthGuard().canActivate(contextFor(req))).resolves.toBe(
      true,
    );
    expect(req).toMatchObject({ user: result.user, session: result.session });
  });
});
