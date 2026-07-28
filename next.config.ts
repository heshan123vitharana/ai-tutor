import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Webpack instead of Turbopack (Turbopack requires native binaries
  // not available in all Windows environments)
  bundler: "webpack",
};

export default nextConfig;
