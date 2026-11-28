import type { UserRole } from "../db/schema";

// Fake people for local development and tests, so nobody needs Google to log
// in on localhost. `.test` is a reserved domain: these can never be real
// accounts or clash with the association's emails. One persona per role; the
// dev-login script applies the role every time it runs.
export const personas = {
  member: {
    name: "Member (dev)",
    email: "member@acmfeup.test",
    role: "member",
  },
  editor: {
    name: "Editor (dev)",
    email: "editor@acmfeup.test",
    role: "editor",
  },
  admin: { name: "Admin (dev)", email: "admin@acmfeup.test", role: "admin" },
} as const satisfies Record<
  string,
  { name: string; email: string; role: UserRole }
>;

export type PersonaName = keyof typeof personas;
