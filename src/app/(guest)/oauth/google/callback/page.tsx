'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { googleLoginAction } from '@/features/auth/action';
import { toast } from 'sonner';
import LoginSuccessModal from '@/features/auth/components/LoginSuccessModal';

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const hasCalled = useRef(false);
    const router = useRouter();

    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(() => {
        if (!code || hasCalled.current) return;
        hasCalled.current = true;

        const login = async () => {
            try {
                await googleLoginAction(code);

                // ✅ 여기 핵심: 모달만 띄움
                setLoginSuccess(true);
            } catch (e) {
                console.error(e);
                toast.error('구글 로그인 처리에 실패했습니다.');
                router.push('/auth/login')
            }
        };

        login();
    }, [code]);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen text-slate-900 bg-white font-medium">
                구글 로그인 처리 중입니다...
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