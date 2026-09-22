# Production image of the API. Build from the repo root, which has the lockfile
# and the workspace:
#   docker build -f apps/api/Dockerfile -t acmfeup-api .

FROM node:24.21.0-slim AS build
WORKDIR /repo
# corepack installs the pnpm pinned in packageManager; LEFTHOOK=0 skips git hooks.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 LEFTHOOK=0
RUN corepack enable

# Manifests first, so the install layer is cached until dependencies change.
# apps/web/package.json is only there because the lockfile lists it.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json packages/config/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @acmfeup/api...

COPY packages/config packages/config
COPY apps/api apps/api
RUN pnpm --filter @acmfeup/api build \
  && pnpm --filter @acmfeup/api deploy --prod --legacy /out

FROM node:24.21.0-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /out/package.json ./
COPY --from=build /out/node_modules node_modules
COPY --from=build /repo/apps/api/dist dist
COPY --from=build /repo/apps/api/drizzle drizzle
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
