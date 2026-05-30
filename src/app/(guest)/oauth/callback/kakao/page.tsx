'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleKakaoLoginCallback } from '@/features/auth/action';
import { toast } from 'sonner';


export default function KakaoCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');

        const login = async () => {
            try {
                const result = await handleKakaoLoginCallback(code as string);

                console.log(result);

                router.push('/student');
            } catch (error) {
                console.error(error);

                toast.error(
                    error instanceof Error
                        ? error.message
                        : '카카오 로그인에 실패하였습니다. 다시 시도해주세요.',
                    {
                        duration: 1500,
                    }
                );
                router.push('/auth/login')
            }
        };

        login();
    }, [router, searchParams]);

    return <div>카카오 로그인 처리중...</div>;
}