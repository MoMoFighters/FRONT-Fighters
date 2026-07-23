import AdminHeader from "@/components/layout/AdminHeader";
import AdminMobileNav from "@/components/layout/AdminMobileNav";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MomoJwtPayload {
    roles?: string;
}

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
        const decoded = jwtDecode<MomoJwtPayload>(token);
        const { roles } = decoded;
        if (roles !== "ROLE_ADMIN") {
            redirect('/forbidden');
        }
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            <AdminHeader />
            <AdminMobileNav />
            <div className="flex min-h-0 flex-1">
                <AdminSidebar />
                <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-7">
                    {children}
                </main>
            </div>
        </div>
    );
}
