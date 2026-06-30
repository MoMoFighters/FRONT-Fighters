import { Toaster } from 'sonner';
import '../app/globals.css'
import { TooltipProvider } from '@/components/ui/tooltip';
import ReactQueryProvider from '@/components/common/ReactQueryProvider';
import KakaoSdkScript from '@/components/common/KakaoSdkScript';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
