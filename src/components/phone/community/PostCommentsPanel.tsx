"use client";

import { useCallback, useMemo, useState } from "react";
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
const REPLY_STALE_TIME = 1000 * 60 * 5;
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
    const initialReplies = useMemo(
        () => parentComment.replies ?? [],
        [parentComment.replies]
    );
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
        staleTime: REPLY_STALE_TIME,
        refetchOnWindowFocus: false,
    });
    const {
        data: repliesData,
        fetchNextPage: fetchNextRepliesPage,
        hasNextPage: hasNextReplyPage,
        isFetchingNextPage: isFetchingNextReplies,
    } = repliesQuery;

    const fetchedReplies = useMemo(
        () =>
            repliesData?.pages
                .flatMap((page) => page.data?.replies ?? [])
                .map((reply) => mapReply(reply, parentComment.commentId)) ?? [],
        [parentComment.commentId, repliesData]
    );
    const replies = useMemo(() => {
        const initialReplyIds = new Set(
            initialReplies.map((reply) => reply.commentId)
        );

        return [
            ...initialReplies,
            ...fetchedReplies.filter(
                (reply) => !initialReplyIds.has(reply.commentId)
            ),
        ];
    }, [fetchedReplies, initialReplies]);

    const handleOpenReplies = useCallback(async () => {
        setIsOpen(true);

        if (
            initialReplies.length === 0 &&
            !repliesData &&
            parentComment.hasMoreReplies
        ) {
            await fetchNextRepliesPage();
        }
    }, [
        fetchNextRepliesPage,
        initialReplies.length,
        parentComment.hasMoreReplies,
        repliesData,
    ]);

    const handleLoadMoreReplies = useCallback(() => {
        void fetchNextRepliesPage();
    }, [fetchNextRepliesPage]);

    return (
        <>
            {isOpen && replies.length > 0 && (
                <div className="space-y-2 pl-4">
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
                    className="ml-10 text-[11px] font-black text-slate-400 transition hover:text-slate-600"
                >
                    답글 보기
                </button>
            )}

            {isOpen && (hasNextReplyPage || (!repliesData && parentComment.hasMoreReplies)) && (
                <button
                    type="button"
                    disabled={isFetchingNextReplies}
                    onClick={handleLoadMoreReplies}
                    className="ml-10 text-[11px] font-black text-slate-400 transition hover:text-slate-600 disabled:cursor-wait disabled:opacity-60"
                >
                    {isFetchingNextReplies ? "불러오는 중" : "답글 더보기"}
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
            <div className="mb-4 shrink-0 border-b border-slate-100 pb-4">
                <h2 className="text-sm font-black text-slate-900">
                    댓글 {commentTotalCount}
                </h2>

                <div className="mt-3">
                    <CommentInputBox
                        postId={postId}
                        role={role}
                        onSubmitComment={onCreateComment}
                    />
                </div>
            </div>

            <div className="max-h-[591px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {comments.map((parentComment) => (
                    <div
                        key={parentComment.commentId}
                        className="space-y-2 mb-2"
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
                        className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-500 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetchingNextComments ? "불러오는 중" : "댓글 더보기"}
                    </button>
                )}
            </div>
        </>
    );
}
