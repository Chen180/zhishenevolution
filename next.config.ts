import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/six-credit/index.html",
        },
        {
          source: "/people",
          destination: "/six-credit/people.html",
        },
      ],
    };
  },
};

export default nextConfig;
