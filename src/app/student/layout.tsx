import StudentHeader from "@/components/layout/StudentHeader";
import Footer from "@/components/layout/Footer";
import StudentLayoutShell from "@/components/layout/StudentLayoutShell";
import StudentNicknameGuard from "@/components/layout/StudentNicknameGuard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getMyInfoService } from "@/app/services/user/service";

interface StudentTokenPayload {
    roles?: string;
    nickname?: string | null;
}

const isMissingNickname = (nickname: unknown) =>
    nickname === null ||
    nickname === undefined ||
    nickname === 'null' ||
    nickname === "";

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

    let nicknameIsNull = isMissingNickname(decoded.nickname);

    if (nicknameIsNull) {
        try {
            const myInfo = await getMyInfoService(token);

            nicknameIsNull =
                isMissingNickname(myInfo.data.userDetail.nickname);
        } catch {
            nicknameIsNull = true;
        }
    }

    return (
        <StudentLayoutShell
            header={<StudentHeader role="student" />}
            footer={<Footer />}
        >
            <StudentNicknameGuard
                nicknameIsNull={nicknameIsNull}
            />
            {children}
        </StudentLayoutShell>
    );
}
