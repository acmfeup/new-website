import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/bc",
        destination: "/",
        permanent: true,
      },
      {
        source: "/rollup",
        destination: "https://forms.gle/PccJzqxDPzEkwBQb7",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
