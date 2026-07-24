"use client";

import { Button } from "@/components/ui/button";

interface SignupSuccessModalProps {
    onConfirm: () => void;
}

export default function SignupSuccessModal({
    onConfirm,
}: SignupSuccessModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex w-full max-w-[240px] flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
                <p className="text-lg font-bold text-slate-900">
                    회원가입 성공!
                </p>

                <p className="text-center text-sm text-slate-600">
                    회원가입이 완료되었습니다.
                    <br />
                    로그인 후 이용해주세요.
                </p>

                <Button
                    type="button"
                    onClick={onConfirm}
                    className="mt-1 h-9 w-1/3 min-w-20 cursor-pointer rounded-lg bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600"
                >
                    확인
                </Button>
            </div>
        </div>
    );
}
