"use client";

import { Button } from "@/components/ui/button";
import { UserRole, UserStatus } from "@/features/user/type";
import { ApiResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { teacherGiveupAction } from "../action";
import TeacherRegistModal from "./TeacherRegistModal";

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

interface LoginResultModalProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    result?: ApiResponse<LoginData>;
}

const fallbackResult: ApiResponse<LoginData> = {
    timestamp: new Date().toISOString(),
    status: 500,
    code: "LOGIN_RESULT_NOT_FOUND",
    message: "로그인 결과를 확인할 수 없습니다.",
};

const getRoleRootHref = (role: UserRole) => {
    if (role === "TEACHER") return "/teacher";
    if (role === "ADMIN") return "/admin";
    return "/student";
};

export default function LoginResultModal({
    setIsModal,
    result,
}: LoginResultModalProps) {
    const router = useRouter();
    const [isGiveupPending, setIsGiveupPending] = useState(false);
    const [mutationMessage, setMutationMessage] = useState("");
    const [isApplyModal, setIsApplyModal] = useState(false);
    const safeResult = result ?? fallbackResult;
    const userInfo = safeResult.data;
    const isHttpSuccess = safeResult.status === 200 || safeResult.status === 201;
    const isActiveUser = isHttpSuccess && userInfo?.status === "ACTIVE";
    const isPendingTeacher =
        isHttpSuccess &&
        userInfo?.role === "TEACHER" &&
        userInfo.status === "PENDING";
    const isRejectedTeacherApplication =
        isHttpSuccess && userInfo?.status === "REJECTED";
    const isActionRequired = isPendingTeacher || isRejectedTeacherApplication;

    const title = isActiveUser
        ? "로그인 성공"
        : isRejectedTeacherApplication
            ? "강사 승인 거절"
            : "로그인 실패";

    const handleCloseFailModal = () => {
        setIsModal(false);
        router.push("/auth/login");
    };

    const handleSuccessConfirm = () => {
        if (!userInfo) {
            handleCloseFailModal();
            return;
        }

        setIsModal(false);

        router.push(getRoleRootHref(userInfo.role));
    };

    const handleTeacherGiveup = async () => {
        if (isGiveupPending) {
            return;
        }

        setIsGiveupPending(true);
        setMutationMessage("");

        try {
            const response = await teacherGiveupAction();

            if (response.status < 200 || response.status >= 300) {
                setMutationMessage(response.message);
                return;
            }

            setIsModal(false);
            router.push("/student");
        } finally {
            setIsGiveupPending(false);
        }
    };
    const closeResultModal = () => {
        if (isActiveUser) return;
        setIsModal(false)
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={closeResultModal}
            >
                <div
                    className="flex w-full max-w-[240px] flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <p className="text-lg font-bold text-slate-900">
                        {title}
                    </p>

                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            {isRejectedTeacherApplication
                                ? "거절 사유는 이메일을 통해 확인해주세요."
                                : mutationMessage || safeResult.message}
                        </p>
                    </div>

                    {isActionRequired ? (
                        <div className="mt-1 grid w-full grid-cols-2 gap-2">
                            <Button
                                type="button"
                                className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-100"
                                onClick={handleTeacherGiveup}
                                disabled={isGiveupPending}
                            >
                                {isGiveupPending ? "처리 중..." : "학생으로 전환"}
                            </Button>
                            <Button
                                type="button"
                                className="h-9 cursor-pointer rounded-lg bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600"
                                onClick={() => setIsApplyModal(true)}
                            >
                                강사 다시 신청
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            onClick={isActiveUser ? handleSuccessConfirm : handleCloseFailModal}
                            className="mt-1 h-9 w-full cursor-pointer rounded-lg bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600"
                        >
                            확인
                        </Button>
                    )}
                </div>
            </div>
            {isApplyModal && (
                <TeacherRegistModal
                    isModal={isApplyModal}
                    setIsModal={setIsApplyModal}
                    nickName={userInfo?.nickname || ""}
                    isReApply={true}
                    closeResultModal={setIsModal}
                />
            )}
        </>
    );
}
