"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface StudentNicknameGuardProps {
    nickname: string | null;
}

export default function StudentNicknameGuard({
    nickname,
}: StudentNicknameGuardProps) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (nickname !== null || pathname.startsWith("/student/mypage")) {
            return;
        }

        router.replace("/student/mypage");
    }, [nickname, pathname, router]);

    return null;
}
