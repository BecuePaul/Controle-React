import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nestjs-pokedex-api.vercel.app/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'static.wikia.nocookie.net' },
    ],
  },
};

export default nextConfig;
