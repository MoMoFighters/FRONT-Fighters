import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-hidden bg-white">
            <AdminHeader />
            <div className="flex-1">
                <div className="fixed left-0 top-14 bottom-0">
                    <AdminSidebar />
                </div>
                <main className="ml-60 h-[calc(100vh-56px)] flex-1 overflow-y-auto px-8 py-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
