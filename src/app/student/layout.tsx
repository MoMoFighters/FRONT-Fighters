import StudentHeader from "@/components/layout/StudentHeader";
import Footer from "@/components/layout/Footer";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default async function StudentLayout({
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
        if (roles === "ROLE_TEACHER") {
            redirect('/forbidden');
        }
    }

    return (
        <StudentLayoutShell
            header={<StudentHeader role="student" />}
            footer={<Footer />}
        >
            {children}
        </StudentLayoutShell>
    );
}