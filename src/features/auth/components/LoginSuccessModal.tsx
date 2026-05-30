'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginSuccessAction } from "../action";

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
            alert(result.message);
            return;
        }

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

        console.log(result)

        setIsModal(false)
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white px-5 pb-8 pt-3 w-[40vw] rounded flex flex-col gap-3">

                <p className="text-xl font-bold">
                    {state.success ? "로그인 성공" : "로그인 실패"}
                </p>

                <p className="text-slate-600">
                    {state.message}
                </p>

                <Button
                    onClick={handleConfirm}
                    className="px-2 py-1 bg-slate-900"
                >
                    확인
                </Button>

            </div>
        </div>
    );
}