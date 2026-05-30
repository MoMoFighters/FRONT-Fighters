'use client'

import { Toaster } from 'sonner';
import '../app/globals.css'
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">

        {/* Kakao SDK */}
        <Script
          id="kakao-sdk"
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init(
                process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
              );

              console.log("Kakao init 완료");
            }
          }}
        />

        {children}

        <Toaster
          position="top-center"
          richColors
        />
      </body>
    </html>
  );
}