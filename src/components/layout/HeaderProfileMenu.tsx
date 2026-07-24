"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { logoutAction } from "@/features/auth/action";
import { clearLectureUploadTasksStorage } from "@/features/lecture/components/teacher/LectureCreateUploadContext";
import { clearChatBotMessagesStorage } from "@/features/chatbot/hooks/useChatBotMessages";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import OneButtonModal from "@/features/modal/OneButtonModal";
import HeaderProfileCard, { HeaderProfileCardProps } from "./HeaderProfileCard";

// 로그아웃 모달을 HoverCardContent 내부(HeaderProfileCard)가 아닌 이 컴포넌트에서 소유한다.
// 모바일에서는 로그아웃 버튼을 탭하는 순간 HoverCard가 hover 이탈로 감지되어 content를 언마운트하는데,
// 모달 state가 그 언마운트되는 트리 안에 있으면 모달이 뜨기도 전에 함께 사라져버린다.
export default function HeaderProfileMenu(props: HeaderProfileCardProps) {
    const queryClient = useQueryClient();
    const [isConfirmModal, setIsConfirmModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogout = async () => {
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
            <HeaderProfileCard
                {...props}
                onLogoutClick={() => setIsConfirmModal(true)}
            />

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
