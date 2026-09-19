const DEFAULT_ORIGINS = ["http://localhost:3000"];

/**
 * CORS_ORIGIN is a comma separated list of allowed origins.
 * Empty or unset falls back to the local web app.
 */
export function parseCorsOrigins(raw?: string): string[] {
  const origins = (raw ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_ORIGINS;
}
