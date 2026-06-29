"use client";

import { Button } from "@/components/ui/button";
import { UserRole, UserStatus } from "@/features/user/type";
import { ApiResponse } from "@/lib/api";
import { AlertCircleIcon, CheckCircle2, XCircle } from "lucide-react";
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
    result: ApiResponse<LoginData>;
}

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
    const userInfo = result.data;
    const isHttpSuccess = result.status === 200 || result.status === 201;
    const isActiveUser = isHttpSuccess && userInfo?.status === "ACTIVE";
    const isPendingTeacher =
        isHttpSuccess &&
        userInfo?.role === "TEACHER" &&
        userInfo.status === "PENDING";
    const isRejectedTeacherApplication =
        isHttpSuccess && userInfo?.status === "REJECTED";
    const isActionRequired = isPendingTeacher || isRejectedTeacherApplication;
    const isLoginSuccess = isActiveUser || isActionRequired;

    const title = isActiveUser
        ? "로그인 성공"
        : isRejectedTeacherApplication
            ? "강사 승인 거절됨"
            : "로그인 실패";

    const [isApplyModal, setIsApplyModal] = useState(false);

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

        if (userInfo.isTempPwd || userInfo.nickname === null) {
            router.push("/student/mypage");
            return;
        }

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

    const handleReapply = () => {
        setIsApplyModal(true);
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setIsModal(false)}
            >
                <div
                    className="flex w-[420px] flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {isRejectedTeacherApplication ? <AlertCircleIcon className="h-14 w-14 text-red-500" />
                        : isLoginSuccess ? (
                            <CheckCircle2 className="h-14 w-14 text-green-500" />
                        ) : (
                            <XCircle className="h-14 w-14 text-red-500" />
                        )}

                    <p className="text-2xl font-bold text-slate-900">
                        {title}
                    </p>

                    <div className="text-center">
                        <p className="text-slate-600">
                            {!isRejectedTeacherApplication
                                ? mutationMessage || result.message
                                : "거절 사유는 이메일을 통해 확인해주세요."}
                        </p>
                    </div>

                    {isActionRequired ? (
                        <div className="mt-2 grid w-full grid-cols-2 gap-2">
                            <Button
                                type="button"
                                className="h-11 cursor-pointer rounded-sm bg-indigo-500 font-bold text-white hover:bg-indigo-600"
                                onClick={handleReapply}
                            >
                                강사 다시 신청
                            </Button>
                            <Button
                                type="button"
                                onClick={handleTeacherGiveup}
                                disabled={isGiveupPending}
                                className="h-11 cursor-pointer rounded-sm border border-slate-500 bg-slate-50 font-bold text-slate-900 hover:border-slate-900 hover:bg-slate-100"
                            >
                                {isGiveupPending ? "처리 중..." : "학생으로 전환"}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            onClick={isActiveUser ? handleSuccessConfirm : handleCloseFailModal}
                            className="mt-2 h-11 w-full cursor-pointer rounded-sm bg-slate-900 font-bold text-white hover:bg-slate-800"
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
                />)}
        </>
    );
}
