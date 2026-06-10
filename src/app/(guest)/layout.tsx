import Footer from "../../components/layout/Footer";
import GuestHeader from "../../components/layout/GuestHeader";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <GuestHeader />
            <main className="bg-white h-full flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
