import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to continue even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds to continue even if there are TypeScript errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
