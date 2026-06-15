'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { googleLoginAction } from '@/features/auth/action';
import LoginResultModal from '@/features/auth/components/LoginResultModal';

interface LoginResult {
    timestamp: string;
    status: number;
    code: string;
    message: string;
}

function GoogleCallbackContent() {
    const searchParams = useSearchParams();
    const authorizationCode = searchParams.get('code');
    const hasCalled = useRef(false);

    const [isModal, setIsModal] = useState(false);
    const [loginResult, setLoginResult] = useState<LoginResult>({
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
                    message: '구글 인가 코드가 없습니다.',
                });
                setIsModal(true);
                return;
            }

            try {
                const response = await googleLoginAction(authorizationCode);

                setLoginResult({
                    timestamp: response.timestamp,
                    status: response.status,
                    code: response.code,
                    message: response.message,
                });
            } catch (error) {
                setLoginResult({
                    timestamp: new Date().toISOString(),
                    status: 500,
                    code: 'GOOGLE_LOGIN_FAILED',
                    message: error instanceof Error
                        ? error.message
                        : '구글 로그인 처리에 실패했습니다.',
                });
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
                    state={loginResult}
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
