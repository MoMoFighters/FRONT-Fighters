import { Toaster } from 'sonner';
import '../app/globals.css'

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
      </body>
    </html>
  );
}
