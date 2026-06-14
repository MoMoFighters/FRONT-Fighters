"use client";

import { logoutAction } from "@/features/auth/action";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { LogOut } from "lucide-react";

export default function LogoutBtn({
    className,
    iconOnly = false,
}: {
    className?: string;
    iconOnly?: boolean;
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
                iconOnly
                    ? "h-9 w-9 rounded-full p-0 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                    : "h-auto p-0 text-sm font-medium text-slate-700 hover:bg-transparent hover:text-slate-950",
                className
            )}
            onClick={handleLogout}
            aria-label="로그아웃"
        >
            {iconOnly ? <LogOut className="h-4 w-4" /> : "로그아웃"}
        </Button>
    );
}
