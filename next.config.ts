import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  output: "standalone",
  // 아래꺼 주석으로 하고 개발
  devIndicators: false,
  // 위에꺼 주석으로 하고 개발
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
    optimizePackageImports: ["radix-ui"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "momocity-bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "momocity-media.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "momocity-meaid.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1w7ptjpsyo7f4.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    qualities: [40, 70, 75, 80]
  },
} satisfies NextConfig;

export default withBundleAnalyzer(nextConfig);
