import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Railway restores .next/cache between builds; a stale Turbopack cache crashed a
    // production build ("Failed to restore data for task"). Build from clean instead.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
