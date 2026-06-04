'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { googleLoginAction } from '@/features/auth/action';
import LoginResultModal from '@/features/auth/components/LoginResultModal';
import { GoogleLoginData } from '@/app/services/auth/service';

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const hasCalled = useRef(false);
    const router = useRouter();

    const [isModal, setIsModal] = useState(false);

    const [loginResult, setLoginResult] = useState<GoogleLoginData>({
        timestamp: '',
        status: 0,
        code: '',
        message: ''
    });

    useEffect(() => {
        if (!code || hasCalled.current) return;

        hasCalled.current = true;

        const login = async () => {
            try {
                const result = await googleLoginAction(code);

                setLoginResult(result);
                setIsModal(true);
            } catch (error) {
                console.error(error);

                setLoginResult({
                    timestamp: new Date().toISOString(),
                    status: 400,
                    code: 'LOGIN_FAILED',
                    message:
                        error instanceof Error
                            ? error.message
                            : '구글 로그인 처리에 실패했습니다.',
                });

                setIsModal(true);
            }
        };

        login();
    }, [code]);

    // useEffect(() => {
    //     if (!isModal) {
    //         router.push('/auth/login')
    //     }
    // }, [isModal])

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-white text-slate-900 font-medium">
                구글 로그인 처리 중입니다...
            </div>

            {isModal && loginResult && (
                <LoginResultModal
                    setIsModal={setIsModal}
                    state={loginResult}
                />
            )}
        </>
    );
}