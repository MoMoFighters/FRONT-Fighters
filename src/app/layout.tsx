import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import '../app/globals.css'
import { TooltipProvider } from '@/components/ui/tooltip';
import ReactQueryProvider from '@/components/common/ReactQueryProvider';
import KakaoSdkScript from '@/components/common/KakaoSdkScript';

export const metadata: Metadata = {
  metadataBase: new URL('https://momocity-six.vercel.app'),
  verification: {
    google: 'Q69RkDWPxAGWddUPSPmatEy4zD9TAer4HqypT26FR2g',
    other: {
      "naver-site-verification": "a4b3761c8ab37abd9a2dcce5d1751492e394d87f",
    },
  },
  title: {
    default: '모모시티',
    template: '%s | 모모시티',
  },
  description: '모모시티는 학습과 활동을 도시 성장으로 연결해 재미있게 배울 수 있는 온라인 학습 플랫폼입니다.',
  applicationName: '모모시티',
  authors: [
    {
      name: '모모파이터즈',
      url: 'https://github.com/MoMoFighters',
    },
  ],
  creator: '모모파이터즈',
  publisher: 'Momo Fighters',
  keywords: [
    '학습',
    '인강',
    '모모시티',
    '갓생',
    'MomoCity'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '모모시티',
    title: '모모시티',
    description: '학습을 통해 나만의 도시를 성장시켜보세요!',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '모모시티 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '모모시티',
    description: '학습을 통해 나만의 도시를 성장시켜보세요!',
    images: ['/images/og-image.png'],
    creator: '@momocity',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">

        <KakaoSdkScript
          javascriptKey={process.env.JAVASCRIPT_KEY ?? ""}
        />

        <ReactQueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ReactQueryProvider>

        <Toaster
          position="top-center"
          richColors
        />
      </body>
    </html>
  );
}
