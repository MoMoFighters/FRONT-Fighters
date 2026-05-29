'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { kakaoLogin, loginSuccessService } from '@/app/services/auth/service';
import LoginSuccessModal from '@/features/auth/components/LoginSuccessModal';
import { loginSuccessAction } from '@/features/auth/action';

interface LoginSuccessModalProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    state: {
        success: boolean;
        message: string;
    };
}

export default function KakaoCallbackPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [accessToken, setAccessToken] = useState('');

    const [isModal, setIsModal] = useState(false);
    const [modalState, setModalState] =
        useState({
            success: false,
            message: '',
        });

    const code = searchParams.get('code');
    useEffect(() => {
        if (!code) {
            return;
        }

        const login = async () => {

            try {

                const result = await kakaoLogin(code);

                console.log(result);
                if (result.success) {
                    setModalState({
                        success: true,
                        message: '로그인에 성공했습니다.'
                    });

                    setIsModal(true);
                }

                // 쿠키는 브라우저가 자동 저장함


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
            {
                isModal && (
                    <LoginSuccessModal
                        setIsModal={setIsModal}
                        state={modalState}
                    />
                )
            }
        </div>
    );
}