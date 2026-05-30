import AdminSidebar from "../../components/layout/AdminSidebar";
import AUthHeader from "../../components/layout/AuthHeader";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <AUthHeader role="admin" />
            </div>
            <div className="flex pt-16 h-full">
                <div className="flex flex-1">
                    <div className="fixed left-0 top-16 bottom-0 w-60">
                        <AdminSidebar />
                    </div>
                    <main className="ml-60 p-12 flex-1 h-[calc(100vh-64px)] overflow-y-auto relative">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}