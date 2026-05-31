'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleKakaoLoginCallback } from '@/features/auth/action';
import { toast } from 'sonner';
import LoginSuccessModal from '@/features/auth/components/LoginResultModal';

export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const hasCalled = useRef(false);

    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(() => {
        if (!code || hasCalled.current) return;
        hasCalled.current = true;

        const login = async () => {
            try {
                await handleKakaoLoginCallback(code);

                // ✅ 모달만 띄움
                setLoginSuccess(true);
            } catch (error) {
                console.error(error);

                toast.error(
                    error instanceof Error
                        ? error.message
                        : '카카오 로그인에 실패하였습니다. 다시 시도해주세요.',
                    { duration: 1500 }
                );

                router.push('/auth/login');
            }
        };

        login();
    }, [code]);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen text-slate-900 bg-white font-medium">
                카카오 로그인 처리 중입니다...
            </div>

            {loginSuccess && (
                <LoginSuccessModal
                    setIsModal={setLoginSuccess}
                    state={{
                        success: true,
                        message: '로그인 성공',
                    }}
                />
            )}
        </>
    );
}