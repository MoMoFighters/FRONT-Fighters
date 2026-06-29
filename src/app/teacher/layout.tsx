import TeacherHeader from "../../components/layout/TeacherHeader";
import Footer from "../../components/layout/Footer";
import TeacherSidebar from "@/components/layout/TeacherSidebar";
import LectureCreateFloatingWidget from "@/features/lecture/components/teacher/LectureCreateFloatingWidget";
import { LectureCreateUploadProvider } from "@/features/lecture/components/teacher/LectureCreateUploadContext";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";

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
        const decoded: JwtPayload = jwtDecode(token);
        const { roles } = decoded;
        if (roles === "ROLE_STUDENT") {
            redirect('/forbidden');
        }
    }

    return (
        <div className="h-screen overflow-hidden bg-slate-50">
            <div className="fixed top-0 left-0 right-0 z-50 h-16">
                <TeacherHeader role="teacher" />
            </div>
            <div className="flex pt-[55px] h-full">
                <main className="flex-1 h-full overflow-y-auto">
                    <div className="min-h-full flex flex-col">

                        <div className="flex-1 flex flex-row h-full">
                            <LectureCreateUploadProvider>
                                <TeacherSidebar />
                                {children}
                                <LectureCreateFloatingWidget />
                            </LectureCreateUploadProvider>
                        </div>

                        <Footer />

                    </div>
                </main>
            </div>
        </div>
    );
}
