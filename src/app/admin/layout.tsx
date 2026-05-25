import AdminSidebar from "../layout/AdminSidebar";
import AUthHeader from "../layout/AuthHeader";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col flex-1">
            <AUthHeader role="admin" />
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="bg-slate-50 p-12 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}