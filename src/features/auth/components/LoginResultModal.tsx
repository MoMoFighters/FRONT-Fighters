'use client'

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { loginSuccessAction } from "../action";

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
        state.status === 200;

    const handleConfirm = async () => {
        if (!isSuccess) {
            setIsModal(false);
            return;
        }

        const result = await loginSuccessAction();

        if (result.status !== 200) {
            setIsModal(false);
            return;
        }

        const { role, is_temp, nickname, } = result.data!;

        // 닉네임 미설정
        if (!nickname) {
            setIsModal(false);
            router.refresh();
            return;
        }

        if (role === 'TEACHER') {
            router.push('/teacher');
            return;
        }

        if (role === 'ADMIN') {
            router.push('/admin');
            return;
        }

        if (role === 'STUDENT') {

            if (is_temp) {
                router.push('/student/mypage/edit');
                return;
            }

            router.push('/student');
            return;
        }

        setIsModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded-xl shadow-2xl border border-slate-200 p-8 flex flex-col items-center gap-4">
                {isSuccess ? (
                    <CheckCircle2
                        className="w-14 h-14 text-green-500"
                    />
                ) : (
                    <XCircle
                        className="w-14 h-14 text-red-500"
                    />
                )}

                <p className="text-2xl font-bold text-slate-900">
                    {isSuccess ? '도시 입장 완료 🏙️' : '로그인 실패'}
                </p>

                <div className="text-center">
                    <p className="text-slate-600">
                        {state.message}
                    </p>
                </div>

                <Button
                    onClick={handleConfirm}
                    className="mt-2 w-full h-11 bg-slate-900 hover:bg-slate-800"
                >
                    확인
                </Button>

            </div>
        </div>
    );
}