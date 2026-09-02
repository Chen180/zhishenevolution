import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/six-credit/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/six-credit/people.html",
        destination: "/people",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
