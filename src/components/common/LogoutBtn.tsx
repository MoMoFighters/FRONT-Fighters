"use client";

import { logoutAction } from "@/features/auth/action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";

export default function LogoutBtn({
    className,
}: {
    className?: string;
}) {
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
        <Button
            variant="ghost"
            className={cn(
                "h-auto p-0 text-sm font-medium text-slate-700 hover:bg-transparent hover:text-slate-950",
                className
            )}
            onClick={handleLogout}
        >
            로그아웃
        </Button>
    );
}