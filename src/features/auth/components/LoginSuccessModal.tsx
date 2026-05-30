'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginSuccessAction } from "../action";
import { CheckCircle2, XCircle } from "lucide-react";

interface LoginSuccessModalProps {
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    state: {
        success: boolean;
        message: string;
    };
}

export default function LoginSuccessModal({
    setIsModal,
    state
}: LoginSuccessModalProps) {

    const router = useRouter();

    const handleConfirm = async () => {

        const result = await loginSuccessAction();

        if (!result.success || !result.data) {
            // alert(result.message);
            return;
        }
        console.log(result)

        const { role, is_temp, nickname } = result.data;

        switch (role) {
            case "TEACHER":
                router.push("/teacher");
                break;

            case "ADMIN":
                router.push("/admin");
                break;

            case "STUDENT":
                if (is_temp) {
                    router.push("/student/mypage/edit");
                } else if (!nickname) {
                    router.push("/student");
                } else {
                    router.push("/student");
                }
                break;
        }

        setIsModal(false)
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div
                className="
            bg-white
            w-[420px]
            rounded-xl
            shadow-2xl
            border border-slate-200
            p-8
            flex flex-col
            items-center
            gap-4
        "
            >

                {
                    state.success ? (
                        <CheckCircle2
                            className="w-14 h-14 text-green-500"
                        />
                    ) : (
                        <XCircle
                            className="w-14 h-14 text-red-500"
                        />
                    )
                }

                <p
                    className="
                text-2xl
                font-bold
                text-slate-900
            "
                >
                    {
                        state.success
                            ? "도시 입장 완료 🏙️"
                            : "로그인 실패"
                    }
                </p>

                <div className="text-center">

                    <p className="text-slate-600">
                        {state.message}
                    </p>

                    {
                        state.success &&
                        state.isTemp && (
                            <p
                                className="mt-3 text-red-500 font-medium text-sm"
                            >
                                임시 비밀번호로 로그인했습니다.
                                <br />
                                보안을 위해 3분 이내 비밀번호를 변경해주세요.
                            </p>
                        )
                    }

                </div>

                <Button
                    onClick={handleConfirm}
                    className="
                mt-2
                w-full
                h-11
                bg-slate-900
                hover:bg-slate-800
            "
                >
                    확인
                </Button>

            </div>

        </div>
    );
}