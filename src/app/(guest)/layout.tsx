import Footer from "../../components/layout/Footer";
import GuestHeader from "../../components/layout/GuestHeader";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="fixed top-0 left-0 right-0 z-50">
                <GuestHeader />
            </div>
            <div className="pt-12 h-full flex flex-1">
                <main className="bg-slate-50 flex-1">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
