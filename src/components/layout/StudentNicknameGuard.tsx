"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface StudentNicknameGuardProps {
    nicknameIsNull: boolean
}

export default function StudentNicknameGuard({
    nicknameIsNull,
}: StudentNicknameGuardProps) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!nicknameIsNull || pathname.startsWith("/student/mypage")) {
            return;
        }

        router.replace("/student/mypage");
    }, [nicknameIsNull, pathname, router]);

    return null;
}
