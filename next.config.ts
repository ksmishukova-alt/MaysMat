import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/branch/proof-constructions",
        destination: "/branch/constructions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
