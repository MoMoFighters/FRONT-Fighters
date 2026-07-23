"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { createGuestbookAction } from "./action";
import { CreateGuestbookResponse } from "./type";
import { toast } from "sonner";

interface GuestbookFormProps {
    ownerId?: number;
    onCancel: () => void;
    onSubmitSuccess?: (guestbook: CreateGuestbookResponse) => void;
}

export default function GuestbookForm({
    ownerId,
    onCancel,
    onSubmitSuccess,
}: GuestbookFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!ownerId || !trimmedContent || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await createGuestbookAction({
                ownerId,
                content: trimmedContent,
            });

            if (response.status >= 400) {
                toast.error(response.message);
                return;
            }

            setContent("");
            if (response.data) {
                onSubmitSuccess?.(response.data);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex h-full flex-col gap-4"
        >
            <div>
                <h3 className="text-lg font-black text-slate-900">
                    방명록 작성
                </h3>
                <p className="mt-1 text-sm font-bold text-slate-400">
                    친구의 도시에 남길 메시지를 작성해주세요.
                </p>
            </div>

            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="방명록을 남겨보세요."
                className="min-h-0 flex-1 resize-none rounded-2xl border border-indigo-100 bg-white p-4 text-sm font-bold leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                maxLength={500}
            />

            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400">
                    {content.length}/500
                </p>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="cursor-pointer rounded-xl border-slate-200 font-bold text-slate-600"
                    >
                        취소
                    </Button>

                    <Button
                        type="submit"
                        disabled={!ownerId || !content.trim() || isSubmitting}
                        className="cursor-pointer rounded-xl bg-indigo-500 font-black text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? "등록 중" : "등록하기"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
