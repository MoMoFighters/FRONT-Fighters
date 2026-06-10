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
                <main className="ml-48 p-12 flex-1 h-[calc(100vh-48px)] overflow-y-auto relative">
                    {children}
                </main>
            </div>
        </div>
    );
}