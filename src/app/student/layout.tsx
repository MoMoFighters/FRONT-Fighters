import StudentHeader from "@/components/layout/StudentHeader";
import StudentFooter from "@/components/layout/StudentFooter";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface StudentTokenPayload {
    roles?: string;
}

export default async function StudentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookie = await cookies();
    const token = cookie.get("accessToken")?.value;

    if (!token) {
        redirect("/auth/login");
    }

    let decoded: StudentTokenPayload;

    try {
        decoded = jwtDecode<StudentTokenPayload>(token);
    } catch {
        redirect("/auth/login");
    }

    if (decoded.roles === "ROLE_TEACHER") {
        redirect("/forbidden");
    }

    return (
        <StudentLayoutShell
            header={<StudentHeader role="student" />}
            footer={<StudentFooter />}
        >
            {children}
        </StudentLayoutShell>
    );
}
