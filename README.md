# ACM FEUP

The website of the ACM FEUP student chapter ([acmfeup.eu](https://acmfeup.eu)) and the API behind the ACM Platform, in one pnpm + Turborepo monorepo.

| Path | Package | What it is |
|---|---|---|
| `apps/web` | `@acmfeup/web` | The public site. Next.js 15, React 19, Tailwind 4. |
| `apps/api` | `@acmfeup/api` | The platform API. NestJS 12, Drizzle ORM, Postgres 18. |
| `packages/config` | `@acmfeup/config` | Shared TypeScript and Biome config. |

## Getting started

You need **Node 24** (see `.nvmrc`), **pnpm** (`npm install -g pnpm`, it switches itself to the version pinned in `package.json`) and **Docker Desktop**, running. If you use Nix, `nix develop` gives you Node and pnpm instead.

```bash
pnpm install
docker compose up -d --wait
pnpm db:migrate
pnpm dev
```

That's it, no `.env` needed: every setting has a local default. Then open:

- http://localhost:3000, the site
- http://localhost:3000/status, which should show both the API and the database as **Connected**
- http://localhost:4000/health, the API's health check

To override a setting, copy `.env.example` to `.env` at the repo root.

> `--wait` matters: without it, `db:migrate` can run before Postgres accepts connections and fail without printing an error.

## Everyday commands

Run these from the repo root.

| Command | What it does |
|---|---|
| `pnpm dev` | Web on `:3000` and API on `:4000`, both reloading on save |
| `pnpm lint` | Biome lint and format check |
| `pnpm format` | Format the whole repo |
| `pnpm typecheck` | TypeScript, no output |
| `pnpm test` | Vitest in every package |
| `pnpm build` | Production build of every package |
| `pnpm db:generate` | Write a migration from changes in `apps/api/src/db/schema.ts` |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Browse the local database |
| `pnpm db:seed` | Insert seed data |
| `pnpm db:reset` | Wipe the local database and migrate it from scratch |

To run something in one package only: `pnpm --filter @acmfeup/api <script>`.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening your first issue or PR. If you work with a coding agent, it should read [AGENTS.md](AGENTS.md).
