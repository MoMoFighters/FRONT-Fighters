'use client';

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendEmailCodeAction, verifyEmailAction } from "../action";

interface EmailVerificationZoneProps {
    isEmailVerified: boolean;
    setIsEmailVerified: (verified: boolean) => void;
}

export default function EmailVerificationZone({
    isEmailVerified,
    setIsEmailVerified
}: EmailVerificationZoneProps) {
    const [email, setEmail] = useState("");
    const [validationCode, setValidationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const [sendCodeState, setSendCodeState] = useState<{ isSuccess: boolean; message: string; expiresIn?: number } | null>(null);
    const [verifyState, setVerifyState] = useState<{ isSuccess: boolean; message: string } | null>(null);

    const [isSendingCode, startSendCodeTransition] = useTransition();
    const [isVerifying, startVerifyTransition] = useTransition();

    const handleSendCode = () => {
        if (!email) return;
        startSendCodeTransition(async () => {
            const result = await sendEmailCodeAction(email);
            const isSuccess = result.status >= 200 && result.status < 300;
            const expiresIn = result.data?.expiresIn;
            setSendCodeState({
                isSuccess,
                message: result.message,
                expiresIn,
            });

            if (isSuccess && expiresIn) {
                setIsCodeSent(true);
                setTimeLeft(expiresIn);
                setVerifyState(null);
            }
        });
    };

    const handleVerifyCode = () => {
        if (!email || !validationCode) return;
        startVerifyTransition(async () => {
            const result = await verifyEmailAction(email, validationCode);
            const isSuccess = result.status >= 200 && result.status < 300;
            setVerifyState({
                isSuccess,
                message: result.message,
            });

            if (isSuccess) {
                setTimeLeft(0);
                setIsEmailVerified(true);
            }
        });
    };

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <>
            <label className="text-right font-bold" htmlFor="email">이메일</label>
            <div className="flex gap-2 min-w-0">
                <input
                    className="border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors disabled:bg-gray-100 disabled:text-slate-500"
                    type="email"
                    placeholder="이메일"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEmailVerified}
                    required
                />

                {isEmailVerified && (
                    <input type="hidden" name="email" value={email} />
                )}

                <Button
                    type="button"
                    className="shrink-0 bg-mauve-500 rounded-none h-10"
                    onClick={handleSendCode}
                    disabled={isSendingCode || isEmailVerified || !email}
                >
                    {isCodeSent ? "재전송" : "인증 요청"}
                </Button>
            </div>

            {/* 발송 상태 메시지 */}
            {sendCodeState && (
                <>
                    <div />
                    <p className={`text-xs -mt-2 ${sendCodeState.isSuccess ? 'text-green-600' : 'text-red-500'}`}>
                        {sendCodeState.message}
                    </p>
                </>
            )}

            {/* 인증번호 입력 영역 */}
            {isCodeSent && (
                <>
                    <label className="text-right font-bold" htmlFor="validationCode">인증번호</label>
                    <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex gap-2 min-w-0">
                            <input
                                className={`border border-slate-300 py-2 px-2 flex-1 min-w-0 h-10
                                    ${isEmailVerified ? "bg-gray-200 text-slate-500" : "text-slate-700"}
                                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                                focus:outline-none focus:border-slate-500 transition-colors`}
                                type="number"
                                placeholder="인증번호"
                                id="validationCode"
                                value={validationCode}
                                onChange={(e) => setValidationCode(e.target.value)}
                                disabled={isEmailVerified}
                                required
                            />
                            <Button
                                type="button"
                                className="shrink-0 bg-mauve-500 rounded-none h-10"
                                onClick={handleVerifyCode}
                                disabled={isVerifying || isEmailVerified || !validationCode}
                            >
                                인증하기
                            </Button>
                        </div>

                        <p className={`text-sm text-right ${isEmailVerified ? "text-green-600" : "text-red-500"}`}>
                            {isEmailVerified
                                ? "이메일 인증이 완료되었습니다."
                                : timeLeft > 0
                                    ? `남은 시간 : ${formatTime(timeLeft)}`
                                    : "인증 시간이 만료되었습니다. 다시 요청해주세요."
                            }
                        </p>
                        {verifyState && !verifyState.isSuccess && (
                            <p className="text-xs text-red-500 text-right">{verifyState.message}</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
