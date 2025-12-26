import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Optimize font loading
    optimizeCss: true,
  },
  // Optimize performance
  poweredByHeader: false,
};

export default nextConfig;
