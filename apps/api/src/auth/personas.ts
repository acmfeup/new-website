// Fake people for local development and tests, so nobody needs Google to log
// in on localhost. `.test` is a reserved domain: these can never be real
// accounts or clash with the association's emails. When roles exist, give each
// persona its role and memberships here and the dev-login script applies them.
export const personas = {
  member: { name: "Member (dev)", email: "member@acmfeup.test" },
} as const;

export type PersonaName = keyof typeof personas;
