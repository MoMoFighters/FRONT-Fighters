import TeacherHeader from "../../components/layout/TeacherHeader";
import Footer from "../../components/layout/Footer";
import TeacherSidebar from "@/components/layout/TeacherSidebar";
import LectureCreateFloatingWidget from "@/features/lecture/components/teacher/LectureCreateFloatingWidget";
import { LectureCreateUploadProvider } from "@/features/lecture/components/teacher/LectureCreateUploadContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface MomoJwtPayload {
    roles?: string;
}

export default async function TeacherLayout({
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
        if (roles === "ROLE_STUDENT") {
            redirect('/forbidden');
        }
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
            <TeacherHeader role="teacher" />

            <div className="flex min-h-0 flex-1">
                <LectureCreateUploadProvider>
                    <TeacherSidebar />

                    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {children}
                        </div>

                        <Footer />
                    </main>

                    <LectureCreateFloatingWidget />
                </LectureCreateUploadProvider>
            </div>
        </div>
    );
}
