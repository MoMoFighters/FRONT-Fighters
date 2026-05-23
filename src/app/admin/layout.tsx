import AUthHeader from "../layout/AuthHeader";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-full flex-col">
            <AUthHeader role="admin" />
            <main className="bg-slate-50 p-12 flex-1">
                {children}
            </main>
        </div>
    );
}