"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getCommunityPostRepliesAction } from "@/features/community/action";
import type { CommunityPostReplyItem } from "@/features/community/type";
import CommentInputBox from "./CommentInputBox";
import CommentItem from "./CommentItem";
import type {
    CommunityComment,
    PostCommentsPanelProps,
} from "./PostDetailSide";

const REPLY_PAGE_SIZE = 5;
const DEFAULT_PROFILE_IMAGE_URL =
    "https://placehold.co/80x80/e0e7ff/4f46e5?text=M";

const mapReply = (
    reply: CommunityPostReplyItem,
    parentId: number
): CommunityComment => ({
    commentId: reply.commentId,
    content: reply.content,
    authorName: reply.authorName,
    authorProfileImageUrl:
        reply.authorProfileImageUrl || DEFAULT_PROFILE_IMAGE_URL,
    authorRole: reply.authorRole,
    authorId: reply.authorId,
    parentId,
    createdAt: reply.createdAt,
    isMine: reply.isMine,
    isWriter: reply.isPostWriter,
});

function CommentRepliesBlock({
    postId,
    parentComment,
    onCreateReply,
    role,
}: {
    postId: number;
    parentComment: CommunityComment;
    onCreateReply: PostCommentsPanelProps["onCreateReply"];
    role?: PostCommentsPanelProps["role"];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const initialReplies = parentComment.replies ?? [];
    const initialReplyCursor =
        initialReplies.length > 0 ? parentComment.nextReplyCursor ?? null : null;

    const repliesQuery = useInfiniteQuery({
        queryKey: [
            "community",
            "post",
            postId,
            "comment",
            parentComment.commentId,
            "replies",
        ],
        queryFn: async ({ pageParam }) => {
            return getCommunityPostRepliesAction({
                postId,
                commentId: parentComment.commentId,
                cursor: pageParam,
                size: REPLY_PAGE_SIZE,
            });
        },
        initialPageParam: initialReplyCursor,
        getNextPageParam: (lastPage) =>
            lastPage.data?.nextCursor ?? undefined,
        enabled: false,
    });

    const fetchedReplies = repliesQuery.data?.pages
        .flatMap((page) => page.data?.replies ?? [])
        .map((reply) => mapReply(reply, parentComment.commentId)) ?? [];
    const replies = [
        ...initialReplies,
        ...fetchedReplies.filter(
            (reply) =>
                !initialReplies.some(
                    (initialReply) => initialReply.commentId === reply.commentId
                )
        ),
    ];

    const handleOpenReplies = async () => {
        setIsOpen(true);

        if (
            initialReplies.length === 0 &&
            !repliesQuery.data &&
            parentComment.hasMoreReplies
        ) {
            await repliesQuery.fetchNextPage();
        }
    };

    return (
        <>
            {isOpen && replies.length > 0 && (
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
                            role={role}
                        />
                    ))}
                </div>
            )}

            {!isOpen && (parentComment.hasMoreReplies || initialReplies.length > 0) && (
                <button
                    type="button"
                    onClick={handleOpenReplies}
                    className="ml-3 rounded-2xl border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-black text-indigo-500 transition hover:bg-indigo-50"
                >
                    답글 보기
                </button>
            )}

            {isOpen && (repliesQuery.hasNextPage || (!repliesQuery.data && parentComment.hasMoreReplies)) && (
                <button
                    type="button"
                    disabled={repliesQuery.isFetchingNextPage}
                    onClick={() => {
                        void repliesQuery.fetchNextPage();
                    }}
                    className="ml-3 rounded-2xl border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-black text-indigo-500 transition hover:bg-indigo-50 disabled:cursor-wait disabled:opacity-60"
                >
                    {repliesQuery.isFetchingNextPage ? "불러오는 중" : "답글 더보기"}
                </button>
            )}
        </>
    );
}

export default function PostCommentsPanel({
    postId,
    commentTotalCount,
    comments,
    hasNextCommentPage,
    isFetchingNextComments,
    onLoadMoreComments,
    onCreateComment,
    onCreateReply,
    role,
}: PostCommentsPanelProps) {
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
                {comments.map((parentComment) => (
                    <div
                        key={parentComment.commentId}
                        className="space-y-2"
                    >
                        <CommentItem
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
                            role={role}
                        />

                        <CommentRepliesBlock
                            postId={postId}
                            parentComment={parentComment}
                            onCreateReply={onCreateReply}
                            role={role}
                        />
                    </div>
                ))}

                {hasNextCommentPage && (
                    <button
                        type="button"
                        disabled={isFetchingNextComments}
                        onClick={onLoadMoreComments}
                        className="w-full rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-500 transition hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetchingNextComments ? "불러오는 중" : "댓글 더보기"}
                    </button>
                )}
                {/* TODO: Extract comment item later. */}
                {/* ===================== COMMUNITY_COMMENT_COMPONENT_END ===================== */}
            </div>
        </>
    );
}
