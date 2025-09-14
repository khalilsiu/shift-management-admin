import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundle optimization for tree shaking (Turbopack compatible)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns'
    ],
  },
};

export default nextConfig;
