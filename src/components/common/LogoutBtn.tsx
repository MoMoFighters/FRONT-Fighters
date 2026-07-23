"use client";

import { useState } from "react";
import { logoutAction } from "@/features/auth/action";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { LogOut } from "lucide-react";
import { clearLectureUploadTasksStorage } from "@/features/lecture/components/teacher/LectureCreateUploadContext";
import { clearChatBotMessagesStorage } from "@/features/chatbot/hooks/useChatBotMessages";
import { useQueryClient } from "@tanstack/react-query";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import OneButtonModal from "@/features/modal/OneButtonModal";

export default function LogoutBtn({
    className,
    iconOnly = false,
}: {
    className?: string;
    iconOnly?: boolean;
}) {
    const queryClient = useQueryClient();
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogout = async () => {
        // 클라이언트 쪽 캐시/스토리지는 서버 액션이 리다이렉트를 던지기 전에 미리 정리해야 함
        queryClient.clear();
        clearLectureUploadTasksStorage();
        clearChatBotMessagesStorage();

        const result = await logoutAction("/");

        if (result.status < 200 || result.status >= 300) {
            setErrorMessage(result.message);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                className={cn(
                    iconOnly
                        ? "h-9 w-9 rounded-full p-0 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                        : "h-auto p-0 text-sm font-medium text-slate-700 hover:bg-transparent hover:text-slate-950",
                    className
                )}
                onClick={() => setIsConfirmModal(true)}
                aria-label="로그아웃"
            >
                {iconOnly ? <LogOut className="h-4 w-4" /> : "로그아웃"}
            </Button>

            <TwoButtonModal
                open={isConfirmModal}
                onOpenChange={setIsConfirmModal}
                title="로그아웃"
                description="정말 로그아웃 하시겠습니까?"
                onConfirm={handleLogout}
            />

            <OneButtonModal
                open={errorMessage.length > 0}
                onOpenChange={(open) => {
                    if (!open) setErrorMessage("");
                }}
                title="로그아웃 실패"
                description={errorMessage}
                onConfirm={() => setErrorMessage("")}
            />
        </>
    );
}
