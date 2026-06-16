import type { NextConfig } from "next";

const nextConfig = {
  // 아래꺼 주석으로 하고 개발
  devIndicators: false,
  // 위에꺼 주석으로 하고 개발
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "momocity-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    // formats: ['image/webp', 'image/avif']
  },
} satisfies NextConfig;

export default nextConfig;
