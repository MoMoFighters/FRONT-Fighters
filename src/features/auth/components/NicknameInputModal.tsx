'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { nicknameRegistAction } from "../action";

export default function NicknameInputModal() {
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

    return (
        <Dialog open={!isClosed} onOpenChange={() => { }}>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>닉네임 설정</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-3 px-1">
                    <p className="shrink-0 text-sm font-bold text-slate-700">
                        닉네임
                    </p>

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
                </div>

                <DialogFooter>
                    <Button
                        disabled={loading || !nickname.trim()}
                        onClick={() => void handleSubmit()}
                        className="bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {
                            loading
                                ? '등록 중...'
                                : '등록'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
