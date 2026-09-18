# AGENTS.md

Conventions for any coding agent working in this repo (Claude Code, Codex, Cursor, Copilot and the like). Humans: [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md) cover the same ground in more detail.

## The one rule

Whoever opens the PR has to be able to explain every change in it during review. So:

- Keep diffs small and on topic. One issue, one PR. No drive-by refactors.
- Say in the PR description why you made each non-obvious choice. "The agent did it" is not an explanation.
- If you can't tell why a piece of existing code is there, ask before changing it.

## Layout

```
apps/web         Next.js 15 site (App Router, src/, Tailwind 4, shadcn-style components)
apps/api         NestJS 12 API, Drizzle ORM on Postgres 18
  src/db/        schema.ts (source of truth), client.ts (pool + db), seed.ts
  drizzle/       generated migrations: never edit by hand
packages/config  shared tsconfig.base.json and biome.json
```

## Commands

Run from the repo root. Local setup is in the README: `pnpm install`, `docker compose up -d --wait`, `pnpm db:migrate`, `pnpm dev`.

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build   # what CI runs
pnpm --filter @acmfeup/api <script>                      # one package only
pnpm db:generate                                         # after editing schema.ts
```

Before calling anything done, run the four checks above and make sure they pass.

## Conventions

**Tooling**
- Lint and format with **Biome**. Do not add ESLint or Prettier.
- `biome.json` files are plain JSON: comments break them. Nested configs need `"root": false`.
- Pin exact versions for tooling (`typescript`, `@biomejs/biome`, `turbo`) and keep them identical across packages.
- Conventional Commits for commit messages and branch prefixes.

**API (NestJS)**
- Never turn a Nest import into `import type`. Dependency injection reads the constructor types from metadata that tsc only emits for runtime imports, which is why Biome's `useImportType` is off for `apps/api`.
- Nothing wraps the database in a Nest provider: import `db` or `pool` from `src/db/client.ts`.
- Environment values are read in `src/config/env.ts`, each with a default that matches `docker-compose.yml`.

**Database**
- Change `src/db/schema.ts`, then run `pnpm db:generate`, and commit the schema, the `.sql` file and `drizzle/meta/` together.
- Never edit a migration that is already merged, and never hand-edit `drizzle/meta/`.
- Migrations must be backwards compatible. The rules are in CONTRIBUTING.md.
- `drizzle-kit push` is for local experiments only.

**Environment variables**
Adding one means touching four places:
1. `.env.example`, with a comment.
2. A default in code, so a fresh clone still runs with no `.env`.
3. `turbo.json`: under `build.env` if it changes build output (anything `NEXT_PUBLIC_*`), otherwise under `dev.passThroughEnv`. Turbo runs in strict mode and silently drops undeclared variables.
4. The CI workflow, if a job needs it.

There is a single `.env`, at the repo root. `apps/api/src/config/env.ts` and `apps/web/next.config.ts` both load it.

**Tests**
- Vitest, next to the code: `foo.ts` gets `foo.test.ts`.
- Vitest's esbuild does not emit decorator metadata, so tests that need Nest DI (`Test.createTestingModule`) need `unplugin-swc` first. Prefer testing plain functions.

**Web**
- Reuse `src/components/ui` and the tokens in `src/app/globals.css`. Do not invent colours.
- Icons come from `lucide-react`. No emojis in the UI.
- The API is called from the browser, with `process.env.NEXT_PUBLIC_API_URL`. `src/app/status/status-check.tsx` is the reference.

## Don't

- Don't touch `vercel.json` or any Vercel setting. Deploy config is manual.
- Don't commit secrets, even fake-looking ones in tests: gitleaks will fail the PR.
- Don't push to `main`, and don't merge PRs. A human does that.

## Running servers during a task

- Check the ports first: `lsof -nP -iTCP:3000,4000 -sTCP:LISTEN`. If they are taken, the human is probably running `pnpm dev`. Use that instance and don't kill it.
- `nest start --watch` leaves its child process behind when you kill the watcher by name. The child keeps port 4000, and the next `pnpm dev` fails with `EADDRINUSE`. Stop the servers you started by their PIDs, then check that the port is free again.
