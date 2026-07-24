"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import { MessageCircle, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";

import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import CommentInputBox from "./CommentInputBox";
import type { CommentItemProps } from "./PostDetailSide";

const formatCommentDate = (createdAt: string) => {
    const [datePart, timePart = ""] = createdAt.split("T");
    const [, month, day] = datePart.split("-");
    const [hour = "00", minute = "00"] = timePart.split(":");

    if (!month || !day) {
        return createdAt.slice(0, 16).replace("T", " ");
    }

    return `${month}/${day} ${hour}:${minute}`;
};

function CommentItem({
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
    role = "STUDENT",
    onSubmitReply,
    onDeleteComment,
    onDeleteReply,
}: CommentItemProps) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isReply = parentId !== null;
    const createdAtText = useMemo(() => formatCommentDate(createdAt), [createdAt]);
    const toggleReplyOpen = useCallback(() => {
        setReplyOpen((prev) => !prev);
    }, []);

    const runDelete = useCallback(async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            const success = isReply && parentId !== null
                ? await onDeleteReply?.(parentId, commentId)
                : await onDeleteComment?.(commentId);

            if (success === false) {
                toast.error(
                    isReply ? "답글 삭제에 실패했습니다." : "댓글 삭제에 실패했습니다."
                );
                return;
            }

            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    }, [commentId, isDeleting, isReply, onDeleteComment, onDeleteReply, parentId]);

    const handleDeleteClick = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, []);

    return (
        <div className="space-y-2">
            <div
                className={isReply
                    ? "rounded-md bg-slate-50 px-3 py-3"
                    : "border-b border-slate-100 bg-white px-1 py-3"
                }
            >
                <div className="flex items-start gap-2">
                    {isReply && (
                        <Reply className="mt-1 h-3.5 w-3.5 shrink-0 rotate-180 text-slate-300" />
                    )}

                    <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <Image
                                    src={authorProfileImageUrl}
                                    alt={`${authorName} profile`}
                                    width={32}
                                    height={32}
                                    className={`${isReply ? "h-7 w-7" : "h-8 w-8"} shrink-0 rounded-md bg-slate-100 object-cover`}
                                    unoptimized
                                />

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className={`${isReply ? "text-xs" : "text-sm"} truncate font-black text-slate-800`}>
                                            {authorName}
                                        </p>
                                        {isWriter && (
                                            <span className="shrink-0 rounded-sm bg-slate-100 px-1 py-0.5 text-[9px] font-black text-slate-500">
                                                작성자
                                            </span>
                                        )}
                                        {isMine && (
                                            <span className="shrink-0 rounded-sm bg-slate-100 px-1 py-0.5 text-[9px] font-black text-slate-500">
                                                나
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-slate-100 bg-white text-slate-300">
                                {!isReply && (
                                    <button
                                        type="button"
                                        onClick={toggleReplyOpen}
                                        className="flex h-7 w-8 items-center justify-center border-r border-slate-100 transition hover:bg-slate-50 hover:text-slate-500"
                                        aria-label="답글 작성"
                                    >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                    </button>
                                )}

                                {role === "ADMIN" ? (
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="flex h-7 w-8 items-center justify-center text-rose-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-wait disabled:opacity-60"
                                        aria-label={isReply ? "답글 삭제" : "댓글 삭제"}
                                        title={isReply ? "답글 삭제" : "댓글 삭제"}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                ) : role === "GUEST" ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="flex h-7 w-8 cursor-not-allowed items-center justify-center text-slate-200"
                                        aria-label="로그인 후 이용해주세요"
                                        title="로그인 후 이용해주세요"
                                    >
                                        ⋮
                                    </button>
                                ) : !isMine ? (
                                    <CreateReportBtn
                                        triggerLabel="⋮"
                                        triggerVariant="icon"
                                        triggerClassName="flex h-7 w-8 cursor-pointer items-center justify-center text-slate-300 transition hover:bg-slate-50 hover:text-rose-500"
                                        targetType="COMMENT"
                                        targetId={commentId}
                                        reportedUserId={authorId}
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="flex h-7 w-8 items-center justify-center text-slate-300 transition hover:bg-rose-50 hover:text-rose-400 disabled:cursor-wait disabled:opacity-60"
                                        aria-label={isReply ? "답글 삭제" : "댓글 삭제"}
                                        title={isReply ? "답글 삭제" : "댓글 삭제"}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className={`${isReply ? "mt-2 text-xs leading-5" : "mt-2 text-sm leading-6"} whitespace-pre-wrap font-bold text-slate-700`}>
                            {content}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                            <span>{createdAtText}</span>
                            {!isReply && (
                                <button
                                    type="button"
                                    onClick={toggleReplyOpen}
                                    className="transition hover:text-slate-600"
                                >
                                    답글
                                </button>
                            )}
                        </div>

                        {!isReply && replyOpen && (
                            <div className="mt-2">
                                <CommentInputBox
                                    postId={postId}
                                    parentId={commentId}
                                    role={role}
                                    onSubmitComment={
                                        onSubmitReply
                                            ? (replyContent) => onSubmitReply(commentId, replyContent)
                                            : undefined
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input
                type="hidden"
                name="authorId"
                value={authorId}
            />

            <TwoButtonModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title={isReply ? "답글을 삭제할까요?" : "댓글을 삭제할까요?"}
                description={
                    isReply
                        ? "삭제한 답글은 다시 볼 수 없습니다."
                        : "삭제한 댓글은 다시 볼 수 없습니다."
                }
                onConfirm={() => void runDelete()}
            />
        </div>
    );
}

export default memo(CommentItem);
