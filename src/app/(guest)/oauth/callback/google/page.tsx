'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { googleLoginAction } from '@/features/auth/action';
import { toast } from 'sonner';

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');

    // StrictMode 등에서 두 번 실행되어 토큰 요청이 중복으로 터지는 것을 방지
    const hasCalled = useRef(false);

    useEffect(() => {
        if (!code || hasCalled.current) return;
        hasCalled.current = true;

        const login = async () => {
            try {
                // 💡 직접 fetch 쏘지 않고, 만들어두신 서버 액션을 실행합니다.
                // 이 안에서 백엔드 통신 및 httpOnly 쿠키 세팅이 전부 서버 측에서 일어납니다.
                await googleLoginAction(code);

                // 💡 Next.js 환경이므로 window.location.href 대신 router.push가 부드럽습니다.
                // 메인 페이지로 이동시키면서 페이지 상태를 완전히 새로고침(refresh) 해줍니다.
                // router.push('/');
                router.refresh();
            } catch (e) {
                console.error(e);
                toast.error('구글 로그인 처리에 실패했습니다.');
                // router.push('/login'); // 실패 시 로그인 페이지로 튕기기
            }
        };

        login();
    }, [code, router]);

    return (
        <div className="flex items-center justify-center min-h-screen text-slate-900 bg-white font-medium">
            구글 로그인 처리 중입니다...
        </div>
    );
}