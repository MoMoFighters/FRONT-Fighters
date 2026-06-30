'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { naverLoginAction } from '@/features/auth/action';
import LoginResultModal from '@/features/auth/components/LoginResultModal';
import { UserRole, UserStatus } from '@/features/user/type';
import { ApiResponse } from '@/lib/api';

interface LoginData {
    accessToken: string;
    refreshToken: string;
    status: UserStatus;
    role: UserRole;
    isTempPwd: boolean;
    nickname: string | null;
    expiresIn: number;
}

function NaverCallbackContent() {
    const searchParams = useSearchParams();
    const authorizationCode = searchParams.get('code');
    const hasCalled = useRef(false);

    const [isModal, setIsModal] = useState(false);
    const [loginResult, setLoginResult] = useState<ApiResponse<LoginData>>({
        timestamp: '',
        status: 0,
        code: '',
        message: '',
    });

    useEffect(() => {
        if (hasCalled.current) return;
        hasCalled.current = true;

        const login = async () => {
            if (!authorizationCode) {
                setLoginResult({
                    timestamp: new Date().toISOString(),
                    status: 400,
                    code: 'AUTHORIZATION_CODE_NOT_FOUND',
                    message: '네이버 인가 코드가 없습니다.',
                });
                setIsModal(true);
                return;
            }

            try {
                const response = await naverLoginAction(authorizationCode);

                setLoginResult(response);
            } catch (error) {
                setLoginResult({
                    timestamp: new Date().toISOString(),
                    status: 500,
                    code: 'NAVER_LOGIN_FAILED',
                    message: error instanceof Error
                        ? error.message
                        : '네이버 로그인 처리에 실패했습니다.',
                });
            }

            setIsModal(true);
        };

        void login();
    }, [authorizationCode]);

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-white font-medium text-slate-900">
                네이버 로그인 처리 중입니다...
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

export default function NaverCallbackPage() {
    return (
        <Suspense
            fallback={(
                <div className="flex min-h-screen items-center justify-center bg-white font-medium text-slate-900">
                    네이버 로그인 처리 중입니다...
                </div>
            )}
        >
            <NaverCallbackContent />
        </Suspense>
    );
}
