'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { kakaoLogin } from '@/app/services/auth/service';


export default function KakaoCallbackPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {

        const code = searchParams.get('code');

        if (!code) {
            return;
        }

        const login = async () => {

            try {

                const result = await kakaoLogin(code);

                console.log(result);

                // 쿠키는 브라우저가 자동 저장함

                router.push('/');

            } catch (error) {

                console.error(error);

                alert(
                    error instanceof Error
                        ? error.message
                        : '로그인에 실패하였습니다.'
                );
            }
        };

        login();

    }, [router, searchParams]);

    return (
        <div>
            카카오 로그인 처리중...
        </div>
    );
}