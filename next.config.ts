import type { NextConfig } from "next";

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
