'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { nicknameRegistAction } from "../action";

interface NicknameInputModalProps {
    nickIsNull: boolean;
}

export default function NicknameInputModal({
    nickIsNull
}: NicknameInputModalProps) {

    const [isModal, setIsModal] =
        useState(nickIsNull);

    const [nickname, setNickname] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState('닉네임을 입력해주세요.');

    const handleSubmit = async () => {
        const result = await nicknameRegistAction(nickname);

        setMessage(result.message);

        if (result.status === 200) {
            setIsModal(false);
        }
    };

    if (!isModal) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                className="bg-white px-5 pb-8 pt-8 w-[40vw] rounded flex flex-col justify-center"
            >
                <h1 className="text-center text-2xl font-semibold mb-4">
                    📝 닉네임 설정
                </h1>

                <div className="flex justify-center">
                    <p className="mb-5 mt-2 text-lg font-bold text-slate-900">
                        {message}
                    </p>
                </div>

                <div className="flex flex-row gap-3 mb-4 items-center px-2">

                    <p>닉네임</p>

                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) =>
                            setNickname(
                                e.target.value
                            )
                        }
                        placeholder="닉네임 입력"
                        className="border border-slate-300 py-2 px-2 flex-1 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />

                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
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