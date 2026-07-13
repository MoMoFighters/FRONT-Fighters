'use client';

import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { tempPwAction } from "../action";

export default function EmailInputModal() {
    const [isModal, setIsModal] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [tempPwSent, setTempPwSent] = useState(false);

    const sendTempPassword = async (_prevState: unknown, formData: FormData) => {
        const email = String(formData.get("email") ?? "");
        return tempPwAction(email);
    };

    const [state, formAction, pending] = useActionState(sendTempPassword, {
        timestamp: "",
        status: 0,
        code: "",
        message: "",
        data: null,
    });

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.status >= 200 && state.status < 300) {
            setTempPwSent(true);
            setInvalidEmail(false);
            return;
        }

        setInvalidEmail(true);
    }, [state]);

    if (!isModal) {
        return (
            <button
                type="button"
                className="cursor-pointer transition-colors hover:text-indigo-500"
                onClick={() => setIsModal(true)}
            >
                비밀번호 찾기
            </button>
        );
    }

    return (
        <>
            <button
                type="button"
                className="text-slate-400"
                disabled
            >
                비밀번호 찾기
            </button>

            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
                onClick={() => setIsModal(false)}
            >
                <div
                    className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white px-6 py-7 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
                        onClick={() => setIsModal(false)}
                        aria-label="닫기"
                    >
                        <X className="h-4 w-4 opacity-70" aria-hidden="true" />
                    </button>

                    <div className="mb-6 pr-10">
                        <p className="text-sm font-semibold text-indigo-500">
                            Account Help
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            비밀번호 찾기
                        </h1>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            가입한 이메일로 임시 비밀번호가 발송됩니다.
                        </p>
                    </div>

                    {!tempPwSent ? (
                        <form action={formAction} className="space-y-5">
                            {invalidEmail && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                    {state.message}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    이메일 인증
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="이메일을 입력해 주세요"
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <Button
                                disabled={pending}
                                className="h-12 w-full rounded-lg bg-indigo-500 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {pending ? "발송 중..." : "임시 비밀번호 발송"}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-6 text-center">
                                <p className="text-lg font-bold text-green-700">
                                    임시 비밀번호를 발송했습니다.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-green-700/80">
                                    이메일함을 확인하고 임시 비밀번호로 로그인해 주세요.
                                </p>
                            </div>

                            <Button
                                onClick={() => setIsModal(false)}
                                className="h-12 w-full rounded-lg bg-indigo-500 text-base font-bold text-white transition-colors hover:bg-indigo-600"
                            >
                                닫기
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
