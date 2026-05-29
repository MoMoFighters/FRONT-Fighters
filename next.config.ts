import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'momocity-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**', // 버킷 뒤에 오는 모든 하위 폴더 및 파일 경로 허용
      },
    ],
  },
};

export default nextConfig;