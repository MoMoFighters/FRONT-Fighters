"use client";

import { FormEvent, useState } from "react";
import type { CommentInputBoxProps } from "./PostDetailSide";

export default function CommentInputBox({
    postId,
    parentId,
}: CommentInputBoxProps) {
    const [content, setContent] = useState("");

    const submitComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO: Connect comment/reply create action with postId, parentId, and content.
        console.log({
            postId,
            parentId,
            content,
        });

        setContent("");
    };

    return (
        <form
            onSubmit={submitComment}
            className="flex gap-1.5"
        >
            <textarea
                style={{ resize: "none" }}
                className="min-h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white"
                placeholder={parentId ? "답글을 입력하세요." : "댓글을 입력하세요."}
                value={content}
                onChange={(event) => setContent(event.target.value)}
            />
            <button
                type="submit"
                disabled={content.trim() === ""}
                className={`rounded-xl px-4 text-xs font-black text-white transition ${content.trim()
                    ? "cursor-pointer bg-indigo-500 hover:bg-indigo-600"
                    : "cursor-not-allowed bg-slate-300"
                    }`}
            >
                작성
            </button>
        </form>
    );
}
