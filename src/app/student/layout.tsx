import AUthHeader from "../layout/AuthHeader";

export default function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <AUthHeader role="student" />
            <main className="bg-slate-50 p-12 flex-1">
                {children}
            </main>
        </div>
    );
}
