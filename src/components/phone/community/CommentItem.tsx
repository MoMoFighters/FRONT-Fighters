"use client";

import { useState } from "react";
import { Reply } from "lucide-react";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import CommentInputBox from "./CommentInputBox";
import type { CommentItemProps } from "./PostDetailSide";

export default function CommentItem({
    postId,
    commentId,
    content,
    authorProfileImageUrl,
    authorName,
    authorId,
    isMine,
    isWriter,
    createdAt,
    parentId,
}: CommentItemProps) {
    const [replyOpen, setReplyOpen] = useState(false);
    const isReply = parentId !== null;

    return (
        <div className="space-y-2">
            <div
                className={`${isReply
                    ? "rounded-xl bg-slate-50 p-3"
                    : "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                    }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">

                        <img
                            src={authorProfileImageUrl}
                            alt={`${authorName} profile`}
                            className={`${isReply ? "h-7 w-7" : "h-8 w-8"} shrink-0 rounded-full object-cover ring-1 ring-indigo-100`}
                        />

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className={`${isReply ? "text-xs" : "text-sm"} truncate font-black text-slate-900`}>
                                    {authorName}
                                </p>
                                {isWriter && (
                                    <span className="shrink-0 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black text-indigo-500">
                                        작성자
                                    </span>
                                )}
                                {isMine && (
                                    <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500">
                                        나
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                                {createdAt.slice(0, 10)}
                            </p>
                        </div>
                    </div>

                    {!isMine && (
                        <CreateReportBtn triggerClassName={`${isReply ? "text-[11px]" : "text-xs"} cursor-pointer px-2 font-bold text-slate-400 hover:text-red-500`} />
                    )}
                </div>

                <p className={`${isReply
                    ? "mt-2 text-xs leading-5"
                    : "mt-3 text-sm leading-6"
                    } font-medium text-slate-600`}
                >
                    {content}
                </p>

                {!isReply && (
                    <button
                        type="button"
                        onClick={() => setReplyOpen((prev) => !prev)}
                        className="mt-3 flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                    >
                        <Reply className="h-3.5 w-3.5" />
                        답글 작성
                    </button>
                )}
            </div>

            {!isReply && replyOpen && (
                <div className="pl-4">
                    <CommentInputBox
                        postId={postId}
                        parentId={commentId}
                    />
                </div>
            )}

            <input
                type="hidden"
                name="authorId"
                value={authorId}
            />
        </div>
    );
}
