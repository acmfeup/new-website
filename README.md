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

## Deploy

The web app deploys on Vercel. The API deploys itself: once CI passes on a merge to `main`, [`deploy-api.yml`](.github/workflows/deploy-api.yml)

1. builds `apps/api/Dockerfile` and pushes it to Artifact Registry,
2. runs the migrations as the `api-migrate` Cloud Run Job and waits for it,
3. deploys the new image to the `api` Cloud Run service (europe-west1, scales to zero, at most 2 instances) without traffic, checks its `/health`, and only then moves traffic to it.

If the migrations or the health check fail, the workflow stops and the previous version stays live. The database is on Neon (Frankfurt). Its connection string is stored only in Secret Manager (`database-url`): not in the repo, not in GitHub, and it never passes through the GitHub runner. GitHub gets short-lived credentials through Workload Identity Federation, and only for `deploy-api.yml` running on `main`. The code that workflow deploys runs with the connection string, so merging to `main` is as sensitive as holding the string itself.

Vercel preview deployments cannot call the production API: `CORS_ORIGIN` only allows `acmfeup.eu` and `www.acmfeup.eu`. This is on purpose. A preview runs new frontend code, which should not run against the production API and its data, and a `*.vercel.app` pattern would also match other people's projects.

**Migrations run before the new code is live, so they must be backwards compatible with the API version currently running.** For the whole window between them, and after any rollback, the old code runs against the new schema. The rules are in [CONTRIBUTING.md](CONTRIBUTING.md#database-migrations).

The GCP side is created by [`infra/setup-gcp.sh`](infra/setup-gcp.sh). Run it once in Cloud Shell (`bash infra/setup-gcp.sh <PROJECT_ID>`), and set the three repository variables it prints, before the first merge that should deploy; until then the deploy workflow fails at authentication. Running it again is safe, and it is also how you rotate the database password: paste the new connection string when it asks, then run the Deploy API workflow by hand, so that the running instances pick up the new string.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening your first issue or PR. If you work with a coding agent, it should read [AGENTS.md](AGENTS.md).
