"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { List, MessageCircle } from "lucide-react";

import {
    createCommunityPostCommentAction,
    createCommunityPostReplyAction,
    deleteCommunityPostCommentAction,
    deleteCommunityPostReplyAction,
    getCommunityPostCommentsAction,
} from "@/features/community/action";
import type {
    CommunityAuthorRole,
    CommunityPostCommentItem,
} from "@/features/community/type";
import PostCommentsPanel from "./PostCommentsPanel";

export type SideMode = "posts" | "comment";

export type CommunityPostCategory =
    | "STUDY"
    | "ART"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

export type { CommunityAuthorRole };

export interface CommunityComment {
    commentId: number;
    content: string;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    authorId: number;
    parentId: number | null;
    createdAt: string;
    isMine: boolean;
    isWriter: boolean;
    hasMoreReplies?: boolean;
    nextReplyCursor?: number | null;
    replies?: CommunityComment[];
}

export interface PostRecommentItemProps {
    postId: number;
    thumbnailUrl: string | null;
    category: CommunityPostCategory;
    createdAt: string;
    title: string;
    authorName: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isActive?: boolean;
    role: CommunityAuthorRole;
}

export interface CommentInputBoxProps {
    postId: number;
    parentId?: number;
    role?: CommunityAuthorRole;
    onSubmitComment?: (content: string) => Promise<boolean> | boolean;
}

export interface CommentItemProps {
    postId: number;
    commentId: number;
    content: string;
    authorProfileImageUrl: string;
    authorName: string;
    authorId: number;
    isMine: boolean;
    isWriter: boolean;
    createdAt: string;
    parentId: number | null;
    role?: CommunityAuthorRole;
    onSubmitReply?: (
        commentId: number,
        content: string
    ) => Promise<boolean> | boolean;
    onDeleteComment?: (commentId: number) => Promise<boolean> | boolean;
    onDeleteReply?: (
        parentId: number,
        replyId: number
    ) => Promise<boolean> | boolean;
}

export interface PostCommentsPanelProps {
    postId: number;
    commentTotalCount: number;
    comments: CommunityComment[];
    hasNextCommentPage: boolean;
    isFetchingNextComments: boolean;
    onLoadMoreComments: () => void;
    onCreateComment: (content: string) => Promise<boolean>;
    onCreateReply: (
        commentId: number,
        content: string
    ) => Promise<boolean>;
    onDeleteComment: (commentId: number) => Promise<boolean>;
    onDeleteReply: (
        parentId: number,
        replyId: number
    ) => Promise<boolean>;
    role?: CommunityAuthorRole;
}

interface PostDetailSideProps {
    postId: number;
    commentTotalCount?: number;
    role?: CommunityAuthorRole;
    recommendedPanel: ReactNode;
}

const COMMENT_PAGE_SIZE = 10;
const COMMUNITY_DETAIL_STALE_TIME = 1000 * 60 * 5;
const DEFAULT_PROFILE_IMAGE_URL =
    "https://placehold.co/80x80/e0e7ff/4f46e5?text=M";

const mapComment = (
    comment: CommunityPostCommentItem
): CommunityComment => ({
    commentId: comment.commentId,
    content: comment.content,
    authorName: comment.authorName,
    authorProfileImageUrl:
        comment.authorProfileImageUrl || DEFAULT_PROFILE_IMAGE_URL,
    authorRole: comment.authorRole,
    authorId: comment.authorId,
    parentId: null,
    createdAt: comment.createdAt,
    isMine: comment.isMine,
    isWriter: comment.isPostWriter,
    hasMoreReplies: Boolean(comment.hasMoreReplies),
    nextReplyCursor: comment.nextReplyCursor ?? null,
    replies: comment.replies?.map((reply) => ({
        commentId: reply.commentId,
        content: reply.content,
        authorName: reply.authorName,
        authorProfileImageUrl:
            reply.authorProfileImageUrl || DEFAULT_PROFILE_IMAGE_URL,
        authorRole: reply.authorRole,
        authorId: reply.authorId,
        parentId: comment.commentId,
        createdAt: reply.createdAt,
        isMine: reply.isMine,
        isWriter: reply.isPostWriter,
    })) ?? [],
});

export default function PostDetailSide({
    postId,
    commentTotalCount,
    role = "STUDENT",
    recommendedPanel,
}: PostDetailSideProps) {
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<SideMode>("posts");

    const commentsQuery = useInfiniteQuery({
        queryKey: ["community", "post", postId, "comments"],
        queryFn: async ({ pageParam }) => {
            return getCommunityPostCommentsAction({
                postId,
                cursor: pageParam,
                size: COMMENT_PAGE_SIZE,
            });
        },
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage) =>
            lastPage.data?.nextCursor ?? undefined,
        enabled: mode === "comment",
        staleTime: COMMUNITY_DETAIL_STALE_TIME,
        refetchOnWindowFocus: false,
    });

    const comments = useMemo(() => {
        return commentsQuery.data?.pages
            .flatMap((page) => page.data?.comments ?? [])
            .map(mapComment) ?? [];
    }, [commentsQuery.data]);

    const loadedCommentTotalCount =
        commentsQuery.data?.pages.at(-1)?.data?.totalCount;
    const displayCommentTotalCount =
        loadedCommentTotalCount ?? commentTotalCount ?? 0;

    const createCommentMutation = useMutation({
        mutationFn: (content: string) =>
            createCommunityPostCommentAction({
                postId,
                content,
            }),
        onSuccess: async (response) => {
            if (response.status === 201) {
                await queryClient.invalidateQueries({
                    queryKey: ["community", "post", postId, "comments"],
                });
            }
        },
    });
    const { mutateAsync: createComment } = createCommentMutation;

    const createReplyMutation = useMutation({
        mutationFn: ({
            commentId,
            content,
        }: {
            commentId: number;
            content: string;
        }) =>
            createCommunityPostReplyAction({
                postId,
                commentId,
                content,
            }),
        onSuccess: async (response, variables) => {
            if (response.status === 201) {
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: [
                            "community",
                            "post",
                            postId,
                            "comments",
                        ],
                    }),
                    queryClient.invalidateQueries({
                        queryKey: [
                            "community",
                            "post",
                            postId,
                            "comment",
                            variables.commentId,
                            "replies",
                        ],
                    }),
                ]);
            }
        },
    });
    const { mutateAsync: createReply } = createReplyMutation;

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) =>
            deleteCommunityPostCommentAction({
                postId,
                commentId,
            }),
        onSuccess: async (response) => {
            if (response.status >= 200 && response.status < 300) {
                await queryClient.invalidateQueries({
                    queryKey: ["community", "post", postId, "comments"],
                });
            }
        },
    });
    const { mutateAsync: deleteComment } = deleteCommentMutation;

    const deleteReplyMutation = useMutation({
        mutationFn: ({
            parentId,
            replyId,
        }: {
            parentId: number;
            replyId: number;
        }) =>
            deleteCommunityPostReplyAction({
                postId,
                commentId: parentId,
                replyId,
            }),
        onSuccess: async (response, variables) => {
            if (response.status >= 200 && response.status < 300) {
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: ["community", "post", postId, "comments"],
                    }),
                    queryClient.invalidateQueries({
                        queryKey: [
                            "community",
                            "post",
                            postId,
                            "comment",
                            variables.parentId,
                            "replies",
                        ],
                    }),
                ]);
            }
        },
    });
    const { mutateAsync: deleteReply } = deleteReplyMutation;

    const { fetchNextPage: fetchNextCommentsPage } = commentsQuery;

    const handleCreateComment = useCallback(async (content: string) => {
        const response = await createComment(content);

        return response.status === 201;
    }, [createComment]);

    const handleCreateReply = useCallback(async (
        commentId: number,
        content: string
    ) => {
        const response = await createReply({
            commentId,
            content,
        });

        return response.status === 201;
    }, [createReply]);

    const handleDeleteComment = useCallback(async (commentId: number) => {
        const response = await deleteComment(commentId);

        return response.status >= 200 && response.status < 300;
    }, [deleteComment]);

    const handleDeleteReply = useCallback(async (
        parentId: number,
        replyId: number
    ) => {
        const response = await deleteReply({ parentId, replyId });

        return response.status >= 200 && response.status < 300;
    }, [deleteReply]);

    const handleLoadMoreComments = useCallback(() => {
        void fetchNextCommentsPage();
    }, [fetchNextCommentsPage]);

    const handlePostsMode = useCallback(() => {
        setMode("posts");
    }, []);

    const handleCommentMode = useCallback(() => {
        setMode("comment");
    }, []);

    return (
        <aside className="flex min-h-[742.5px] flex-1 flex-col rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100 [container-type:inline-size]">
            <div className="mb-5 shrink-0 rounded-2xl bg-slate-50 p-1">
                <div className="grid grid-cols-2 gap-1">
                    <button
                        type="button"
                        onClick={handlePostsMode}
                        className={`flex h-[clamp(2rem,9cqw,2.25rem)] items-center justify-center gap-1.5 rounded-xl text-[clamp(0.75rem,3cqw,0.75rem)] font-black transition ${mode === "posts"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                            }`}
                    >
                        <List className="h-[clamp(0.75rem,3.2cqw,0.875rem)] w-[clamp(0.75rem,3.2cqw,0.875rem)]" />
                        추천 게시물
                    </button>

                    <button
                        type="button"
                        onClick={handleCommentMode}
                        className={`flex h-[clamp(2rem,9cqw,2.25rem)] items-center justify-center gap-1.5 rounded-xl text-[clamp(0.75rem,3cqw,0.75rem)] font-black transition ${mode === "comment"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                            }`}
                    >
                        <MessageCircle className="h-[clamp(0.75rem,3.2cqw,0.875rem)] w-[clamp(0.75rem,3.2cqw,0.875rem)]" />
                        댓글 {displayCommentTotalCount}
                    </button>
                </div>
            </div>

            {mode === "comment" ? (
                <PostCommentsPanel
                    postId={postId}
                    commentTotalCount={displayCommentTotalCount}
                    comments={comments}
                    hasNextCommentPage={Boolean(commentsQuery.hasNextPage)}
                    isFetchingNextComments={commentsQuery.isFetchingNextPage}
                    onLoadMoreComments={handleLoadMoreComments}
                    onCreateComment={handleCreateComment}
                    onCreateReply={handleCreateReply}
                    onDeleteComment={handleDeleteComment}
                    onDeleteReply={handleDeleteReply}
                    role={role}
                />
            ) : (
                recommendedPanel
            )}
        </aside>
    );
}
