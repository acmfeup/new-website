import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/bc',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
