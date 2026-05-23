import GuestHeader from "../layout/GuestHeader";

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <GuestHeader />
            <main className="bg-slate-50 p-12 flex-1">
                {children}
            </main>
        </div>
    );
}
