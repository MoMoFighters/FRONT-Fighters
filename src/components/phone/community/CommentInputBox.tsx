"use client";

import { FormEvent, useState } from "react";
import type { CommentInputBoxProps } from "./PostDetailSide";

export default function CommentInputBox({
    parentId,
    onSubmitComment,
}: CommentInputBoxProps) {
    const [content, setContent] = useState("");

    const submitComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || !onSubmitComment) {
            return;
        }

        const isSuccess = await onSubmitComment(trimmedContent);

        if (isSuccess) {
            setContent("");
        }
    };

    return (
        <form
            onSubmit={submitComment}
            className="flex gap-1.5"
        >
            <textarea
                style={{ resize: "none" }}
                className="min-h-9 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
                placeholder={parentId ? "답글을 입력하세요." : "댓글을 입력하세요."}
                value={content}
                onChange={(event) => setContent(event.target.value)}
            />
            <button
                type="submit"
                disabled={content.trim() === ""}
                className={`rounded-md px-3 text-xs font-black text-white transition ${content.trim()
                    ? "cursor-pointer bg-slate-700 hover:bg-slate-800"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
            >
                작성
            </button>
        </form>
    );
}
