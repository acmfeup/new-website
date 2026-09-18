import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { NextConfig } from "next";

// The monorepo keeps one .env at the root, but Next only reads its own
// folder. Load the root one here, before NEXT_PUBLIC_* values get inlined.
const rootEnv = resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) {
  process.loadEnvFile(rootEnv);
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/bc",
        destination: "https://acmfeup.eu",
        permanent: true,
      },
      {
        source: "/rollup",
        destination: "https://acmfeup.eu",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
