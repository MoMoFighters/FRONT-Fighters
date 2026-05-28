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
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
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