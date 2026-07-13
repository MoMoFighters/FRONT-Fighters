'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAction, nicknameRegistAction } from "../action";

interface NicknameInputModalProps {
    nickIsNull: boolean;
}

export default function NicknameInputModal({
    nickIsNull
}: NicknameInputModalProps) {
    const router = useRouter();

    const [isClosed, setIsClosed] =
        useState(false);

    const [nickname, setNickname] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState('닉네임을 입력해주세요.');

    const handleSubmit = async () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setMessage("닉네임을 입력해주세요.");
            return;
        }

        setLoading(true);
        const result = await nicknameRegistAction(trimmedNickname);

        setMessage(result.message);
        setLoading(false);

        if (result.status === 200) {
            setIsClosed(true);
            router.refresh();
        }
    };

    if (!nickIsNull || isClosed) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-6 py-7 shadow-2xl"
            >
                <h1 className="mb-4 text-center text-lg font-bold text-slate-900">
                    📝 닉네임 설정
                </h1>

                <div className="flex justify-center">
                    <p className="mb-5 mt-2 text-sm font-semibold text-slate-600">
                        {message}
                    </p>
                </div>

                <div className="flex flex-row gap-3 mb-4 items-center px-2">

                    <p className="text-sm font-semibold text-slate-700">닉네임</p>

                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) =>
                            setNickname(
                                e.target.value
                            )
                        }
                        placeholder="닉네임 입력"
                        className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />

                    <Button
                        disabled={loading || !nickname.trim()}
                        onClick={handleSubmit}
                        className="rounded-lg bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {
                            loading
                                ? '등록 중...'
                                : '등록'
                        }
                    </Button>

                </div>
            </div>
        </div>
    );
}
