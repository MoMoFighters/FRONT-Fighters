import { Toaster } from 'sonner';
import '../app/globals.css'
import Footer from './layout/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-center"
          richColors
        />
        <Footer />
      </body>
    </html>
  );
}
