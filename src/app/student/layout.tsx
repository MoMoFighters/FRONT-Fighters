import StudentHeader from "@/components/layout/StudentHeader";
import StudentFooter from "@/components/layout/StudentFooter";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";
import OpenChatBotBtn from "@/features/chatbot/components/OpenChatBotBtn";
import { getMyInfo } from "@/features/user/action";
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

    // getMyInfo()는 StudentHeader에서도 호출되지만 unstable_cache(30초)로 공유되어 실제 네트워크 요청은 중복되지 않는다
    const myInfo = await getMyInfo();
    const membership = myInfo.data?.membership ?? "BASIC";

    return (
        <>
            <StudentLayoutShell
                header={<StudentHeader role="student" />}
                footer={<StudentFooter />}
            >
                {children}
            </StudentLayoutShell>
            <OpenChatBotBtn membership={membership} />
        </>
    );
}
