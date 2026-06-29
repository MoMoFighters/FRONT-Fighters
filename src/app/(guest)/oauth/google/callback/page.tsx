"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { googleLoginAction } from "@/features/auth/action";
import LoginResultModal from "@/features/auth/components/LoginResultModal";
import { UserRole, UserStatus } from "@/features/user/type";
import { ApiResponse } from "@/lib/api";

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

const createOAuthErrorResult = (
    code: string,
    message: string,
    status = 500
): ApiResponse<LoginData> => ({
    timestamp: new Date().toISOString(),
    status,
    code,
    message,
});

function GoogleCallbackContent() {
    const searchParams = useSearchParams();
    const authorizationCode = searchParams.get("code");
    const hasCalled = useRef(false);
    const [isModal, setIsModal] = useState(false);
    const [loginResult, setLoginResult] = useState<ApiResponse<LoginData>>(
        createOAuthErrorResult("", "")
    );

    useEffect(() => {
        if (hasCalled.current) return;
        hasCalled.current = true;

        const login = async () => {
            if (!authorizationCode) {
                setLoginResult(
                    createOAuthErrorResult(
                        "AUTHORIZATION_CODE_NOT_FOUND",
                        "구글 인가 코드가 없습니다.",
                        400
                    )
                );
                setIsModal(true);
                return;
            }

            try {
                const response = await googleLoginAction(authorizationCode);
                setLoginResult(response);
            } catch (error) {
                setLoginResult(
                    createOAuthErrorResult(
                        "GOOGLE_LOGIN_FAILED",
                        error instanceof Error
                            ? error.message
                            : "구글 로그인 처리에 실패했습니다."
                    )
                );
            }

            setIsModal(true);
        };

        void login();
    }, [authorizationCode]);

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-white font-medium text-slate-900">
                구글 로그인 처리 중입니다...
            </div>

            {isModal && (
                <LoginResultModal
                    setIsModal={setIsModal}
                    result={loginResult}
                />
            )}
        </>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense
            fallback={(
                <div className="flex min-h-screen items-center justify-center bg-white font-medium text-slate-900">
                    구글 로그인 처리 중입니다...
                </div>
            )}
        >
            <GoogleCallbackContent />
        </Suspense>
    );
}
