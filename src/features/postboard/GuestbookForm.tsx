'use client'

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

interface GuestbookFormProps {
    onCancel: () => void;
    onSubmitSuccess?: () => void;
}

export default function GuestbookForm({
    onCancel,
    onSubmitSuccess,
}: GuestbookFormProps) {

    const [content, setContent] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO: 방명록 작성 API 연결 지점
        // payload 예시: { content }
        // 성공 후 onSubmitSuccess?.() 호출하고 목록을 다시 조회하면 됨.
        onSubmitSuccess?.();
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
                <p className="mt-1 text-sm font-semibold text-slate-400">
                    친구의 도시에 남길 메시지를 작성해주세요.
                </p>
            </div>

            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="따뜻한 방명록을 남겨보세요."
                className="min-h-0 flex-1 resize-none rounded-2xl border border-indigo-100 bg-white p-4 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
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
                        disabled={!content.trim()}
                        className="cursor-pointer rounded-xl bg-indigo-500 font-black text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        등록하기
                    </Button>
                </div>
            </div>
        </form>
    );
}
