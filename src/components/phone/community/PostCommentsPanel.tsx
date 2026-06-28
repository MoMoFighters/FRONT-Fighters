"use client";

import { useMemo } from "react";
import CommentInputBox from "./CommentInputBox";
import CommentItem from "./CommentItem";
import type {
    CommunityComment,
    PostCommentsPanelProps,
} from "./PostDetailSide";

export default function PostCommentsPanel({
    postId,
    commentTotalCount,
    comments,
    hasNextCommentPage,
    onLoadMoreComments,
    repliesByCommentId,
    onLoadMoreReplies,
    onCreateComment,
    onCreateReply,
}: PostCommentsPanelProps) {
    const parentComments = useMemo(
        () => comments.filter((item) => item.parentId === null),
        [comments]
    );

    const repliesByParentId = useMemo(() => {
        return comments.reduce<Record<number, CommunityComment[]>>((acc, item) => {
            if (item.parentId === null) {
                return acc;
            }

            acc[item.parentId] = [...(acc[item.parentId] ?? []), item];
            return acc;
        }, {});
    }, [comments]);

    return (
        <>
            <div className="mb-3 shrink-0">
                <h2 className="text-base font-black text-slate-900">
                    댓글 {commentTotalCount}
                </h2>

                <div className="mt-2">
                    <CommentInputBox
                        postId={postId}
                        onSubmitComment={onCreateComment}
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* ==================== COMMUNITY_COMMENT_COMPONENT_START ==================== */}
                {/* TODO: Extract comment item later. */}
                {parentComments.map((parentComment) => {
                    const replies = repliesByParentId[parentComment.commentId] ?? [];

                    return (
                        <div
                            key={parentComment.commentId}
                            className="space-y-2"
                        >
                            <CommentItem
                                key={parentComment.commentId}
                                postId={postId}
                                commentId={parentComment.commentId}
                                content={parentComment.content}
                                authorProfileImageUrl={parentComment.authorProfileImageUrl}
                                authorName={parentComment.authorName}
                                authorId={parentComment.authorId}
                                isMine={parentComment.isMine}
                                isWriter={parentComment.isWriter}
                                createdAt={parentComment.createdAt}
                                parentId={parentComment.parentId}
                                onSubmitReply={onCreateReply}
                            />

                            {replies.length > 0 && (
                                <div className="space-y-2 border-l-2 border-indigo-100 pl-3">
                                    {replies.map((reply) => (
                                        <CommentItem
                                            key={reply.commentId}
                                            postId={postId}
                                            commentId={reply.commentId}
                                            content={reply.content}
                                            authorProfileImageUrl={reply.authorProfileImageUrl}
                                            authorName={reply.authorName}
                                            authorId={reply.authorId}
                                            isMine={reply.isMine}
                                            isWriter={reply.isWriter}
                                            createdAt={reply.createdAt}
                                            parentId={reply.parentId}
                                            onSubmitReply={onCreateReply}
                                        />
                                    ))}
                                </div>
                            )}

                            {repliesByCommentId[parentComment.commentId]?.hasMore && (
                                <button
                                    type="button"
                                    onClick={() => onLoadMoreReplies(parentComment.commentId)}
                                    className="ml-3 rounded-2xl border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-black text-indigo-500 transition hover:bg-indigo-50"
                                >
                                    ?듦? ??蹂닿린
                                </button>
                            )}
                        </div>
                    );
                })}

                {hasNextCommentPage && (
                    <button
                        type="button"
                        onClick={onLoadMoreComments}
                        className="w-full rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-500 transition hover:bg-indigo-100"
                    >
                        댓글 더 보기
                    </button>
                )}
                {/* TODO: Extract comment item later. */}
                {/* ===================== COMMUNITY_COMMENT_COMPONENT_END ===================== */}
            </div>
        </>
    );
}
