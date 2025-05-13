import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mock Node.js modules for client-side bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        os: false,
        "gcp-metadata": false,
      };
    }
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb", // Increase payload limit to 5MB
    },
  },
};

export default nextConfig;
