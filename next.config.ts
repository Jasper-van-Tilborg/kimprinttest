import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k-imprint.nl',
        pathname: '/cdn/shop/files/**',
      },
    ],
  },
};

export default nextConfig;
