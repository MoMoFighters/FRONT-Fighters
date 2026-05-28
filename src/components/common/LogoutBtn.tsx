'use client'

import { logoutAction } from "@/features/auth/action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {

    const router = useRouter();

    const handleLogout = async () => {
        const result = await logoutAction();

        if (result.success) {
            router.replace("/");
            router.refresh();
        } else {
            alert(result.message);
        }
    };

    return (
        <Button variant="ghost" onClick={handleLogout}>
            로그아웃
        </Button>
    );
}