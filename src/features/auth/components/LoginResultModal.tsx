'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { loginSuccessAction } from '../action';

interface LoginResultModalProps {
    setIsModal: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    state: {
        timestamp: string;
        status: number;
        code: string;
        message: string;
    };
}

export default function LoginResultModal({
    setIsModal,
    state,
}: LoginResultModalProps) {
    const router = useRouter();

    const isSuccess =
        state.status === 200 || state.status === 201;

    const handleConfirm = async () => {
        if (!isSuccess) {
            setIsModal(false);
            router.push('/auth/login')
        }

        try {
            const result = await loginSuccessAction();

            if (
                result.status !== 200 &&
                result.status !== 201
            ) {
                setIsModal(false);
                return;
            }

            const { role, is_tempPwd } = result.data!;

            if (role === 'TEACHER') {
                router.replace('/teacher');
                return;
            }

            if (role === 'ADMIN') {
                router.replace('/admin');
                return;
            }

            if (role === 'STUDENT') {
                if (is_tempPwd) {
                    router.replace('/student/mypage/edit');
                    return;
                }

                router.replace('/student');
                return;
            }

            setIsModal(false);
        } catch {
            setIsModal(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex w-[420px] flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 shadow-2xl">
                {isSuccess ? (
                    <CheckCircle2 className="h-14 w-14 text-green-500" />
                ) : (
                    <XCircle className="h-14 w-14 text-red-500" />
                )}

                <p className="text-2xl font-bold text-slate-900">
                    {isSuccess
                        ? '로그인 성공'
                        : '로그인 실패'}
                </p>

                <div className="text-center">
                    <p className="text-slate-600">
                        {state.message}
                    </p>
                </div>

                <Button
                    onClick={handleConfirm}
                    className="mt-2 h-11 w-full bg-slate-900 hover:bg-slate-800"
                >
                    확인
                </Button>
            </div>
        </div>
    );
}