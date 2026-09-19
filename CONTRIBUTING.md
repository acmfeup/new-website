# Contributing

Everything goes through an issue and a pull request. Nobody pushes to `main`.

## From issue to merge

1. **Open an issue** with the Feature or Bug template. If the idea is still fuzzy, open it anyway and leave the open questions in it.
2. **Get it to Ready** (see below). Only Ready issues get picked up.
3. **Assign yourself** and branch off `main` with a Conventional Commits type as the prefix: `feat/member-directory`, `fix/status-cors`, `docs/readme-setup`.
4. **Open a draft PR within seven days** (see below), even if it holds a single commit. Link the issue with `Closes #123`.
5. **Commit in small steps** with [Conventional Commits](https://www.conventionalcommits.org) messages (`feat(api): ...`, `fix(web): ...`). The pre-commit hook formats and lints staged files for you.
6. **Mark the PR ready for review** once CI is green and every item of the PR checklist is ticked, or marked N/A with a reason.
7. **Review.** The code owner is requested automatically. Answer the comments, push fixes, and re-request review.
8. **Merge** once the PR is approved and green.

### Definition of Ready

An issue is Ready when all of these hold:

- The **problem** says what is missing or broken, and for whom.
- **Done when** lists outcomes a reviewer can check one by one.
- The **area** is set: web, api, database, or tooling / CI.
- There are **no open questions** left.
- It fits in about **a week of work**. If it doesn't, split it into several issues.

### The seven day rule

If an issue has been assigned to you for seven days and there is still no draft PR linked to it, it gets unassigned so someone else can take it. A draft PR is how you show the work is moving, so open one early, even if it isn't finished. If you are blocked, say so in the issue before the seven days run out.

## Before you open a PR

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

CI runs the same four checks, plus a secret scan (gitleaks) and the migrations job below. A red CI means the PR is not ready for review.

## Database migrations

The schema lives in `apps/api/src/db/schema.ts`. The migrations in `apps/api/drizzle/` are how that schema reaches every database, including production, so they follow stricter rules than the rest of the code.

- **Generate, then review the `.sql`.** After editing `schema.ts`, run `pnpm db:generate` and commit the new `.sql` file and `drizzle/meta/` together with the schema change. Reviewers read the SQL, not just the TypeScript, because the SQL is what actually runs.
- **A merged migration is never edited.** Other databases have already applied it, and editing it will not re-run it anywhere. If it was wrong, fix it with a new migration.
- **Every migration is backwards compatible.** The code already running in production must keep working after the migration applies. The schema and the code never switch over at the same instant, and rolling back puts old code on top of the new schema. In practice:
  - Add columns as nullable or with a default.
  - To rename a column, add the new one, copy the data, move the code over, and drop the old one in a later PR.
  - Never drop a column or table in the same PR that stops using it.
- **`drizzle-kit push` is for your local database only.** It changes the schema directly, without writing a migration, which is handy to try something out. Nothing that reaches a PR is created that way: run `pnpm db:reset`, then `pnpm db:generate`, so the migration gets written and tested for real.

CI enforces two of these on every PR: it applies every migration to an empty database, and it fails if `pnpm db:generate` produces a file you did not commit.

## Secrets

Never commit tokens, passwords or real credentials. Local settings go in `.env`, which git ignores. The only env file in the repo is `.env.example`, and it holds local defaults only. Gitleaks scans every PR, and a finding turns it red. If a real secret was ever pushed, deleting it in a new commit is not enough: rotate it, then tell a maintainer.

## Working with coding agents

Agents are welcome. The rule is the same as for any code: **whoever opens the PR has to be able to explain every change in it during review**, including code they did not type themselves. Agents should read [AGENTS.md](AGENTS.md) first.
