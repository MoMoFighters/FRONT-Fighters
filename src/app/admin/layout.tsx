import AdminHeader from "@/components/layout/AdminHeader";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookie = await cookies();
    const token = cookie.get('accessToken')?.value;

    if (!token) {
        redirect('/auth/login');
    }
    if (token) {
        // 옵션 없이 사용하면 페이로드(내용)를 디코딩합니다.
        const decoded = jwtDecode(token);
        const { roles } = decoded;
        if (roles !== "ROLE_ADMIN") {
            redirect('/forbidden');
        }
    }

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
