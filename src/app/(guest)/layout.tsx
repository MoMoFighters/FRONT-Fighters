import Footer from "../layout/Footer";
import GuestHeader from "../layout/GuestHeader";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <GuestHeader />
            </div>
            <div className="pt-16 h-full">
                <main className="bg-slate-50 p-12 flex-1">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
