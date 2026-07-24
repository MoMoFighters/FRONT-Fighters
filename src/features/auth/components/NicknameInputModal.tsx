'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

    const [errorMessage, setErrorMessage] =
        useState('');

    const handleSubmit = async () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setErrorMessage("닉네임을 입력해주세요.");
            return;
        }

        setLoading(true);
        const result = await nicknameRegistAction(trimmedNickname);
        setLoading(false);

        if (result.status !== 200) {
            setErrorMessage(result.message);
            return;
        }

        setErrorMessage("");
        setIsClosed(true);
        toast.success(`${trimmedNickname}님 환영합니다!`);
        router.refresh();
    };

    return (
        <Dialog open={!isClosed} onOpenChange={() => { }}>
            <DialogContent
                showCloseButton={false}
                className="max-w-[286px] sm:max-w-[286px]"
                onEscapeKeyDown={(event) => event.preventDefault()}
                onPointerDownOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>모모시티에 오신걸 환영합니다!</DialogTitle>
                    <DialogDescription>
                        모모시티에서 활동할 닉네임을 설정해주세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 px-1">
                        <p className="shrink-0 text-sm font-bold text-slate-700">
                            닉네임
                        </p>

                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setErrorMessage("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading && nickname.trim()) {
                                    e.preventDefault();
                                    void handleSubmit();
                                }
                            }}
                            placeholder="닉네임 입력"
                            className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    <p className="min-h-4 px-1 text-right text-xs font-medium text-red-500">
                        {errorMessage}
                    </p>
                </div>

                <DialogFooter className="items-center justify-center sm:justify-center pt-0">
                    <Button
                        disabled={loading || !nickname.trim()}
                        onClick={() => void handleSubmit()}
                        className="w-1/3 min-w-24 bg-indigo-500 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
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
