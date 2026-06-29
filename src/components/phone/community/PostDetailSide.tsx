"use client";

import { useMemo, useState } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { List, MessageCircle } from "lucide-react";

import {
    createCommunityPostCommentAction,
    createCommunityPostReplyAction,
    getCommunityPostCommentsAction,
    getCommunityPostRecommendationsAction,
} from "@/features/community/action";
import type {
    CommunityPostCommentItem,
    CommunityRecommendedPostItem,
} from "@/features/community/type";
import PostCommentsPanel from "./PostCommentsPanel";
import PostRecommandPanel from "./PostRecommandPanel";

export type SideMode = "posts" | "comment";

export type CommunityPostCategory =
    | "STUDY"
    | "ART"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

export type CommunityAuthorRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface RecommendedPost {
    postId: number;
    title: string;
    category: CommunityPostCategory;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnailUrl: string | null;
    authorName: string;
    authorProfileImageUrl: string;
    authorRole: CommunityAuthorRole;
    createdAt: string;
}

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
    role: "ADMIN" | "TEACHER" | "STUDENT"
}

export interface PostRecommandPanelProps {
    currentPostId: number;
    posts: RecommendedPost[];
    role: "TEACHER" | "ADMIN" | "STUDENT"
}

export interface CommentInputBoxProps {
    postId: number;
    parentId?: number;
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
    role?: "TEACHER" | "ADMIN" | "STUDENT";
    onSubmitReply?: (
        commentId: number,
        content: string
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
    role?: "TEACHER" | "ADMIN" | "STUDENT";
}

interface PostDetailSideProps {
    postId: number;
    commentTotalCount?: number;
    role?: "TEACHER" | 'ADMIN' | 'STUDENT'
}

const COMMENT_PAGE_SIZE = 10;
const DEFAULT_PROFILE_IMAGE_URL =
    "https://placehold.co/80x80/e0e7ff/4f46e5?text=M";

const mapRecommendedPost = (
    post: CommunityRecommendedPostItem
): RecommendedPost => ({
    postId: post.postId,
    title: post.title,
    category: post.category,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: 0,
    thumbnailUrl: post.thumbnailUrl,
    authorName: post.authorName,
    authorProfileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
    authorRole: "STUDENT",
    createdAt: post.createdAt,
});

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
    role = "STUDENT"
}: PostDetailSideProps) {
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<SideMode>("posts");

    const recommendationsQuery = useQuery({
        queryKey: ["community", "post", postId, "recommendations"],
        queryFn: async () => {
            const response =
                await getCommunityPostRecommendationsAction(postId);

            return response.data
                ? [
                    ...response.data.topPosts,
                    ...response.data.authorPosts,
                ].map(mapRecommendedPost)
                : [];
        },
        enabled: mode === "posts",
    });

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

    const handleCreateComment = async (content: string) => {
        const response = await createCommentMutation.mutateAsync(content);

        return response.status === 201;
    };

    const handleCreateReply = async (
        commentId: number,
        content: string
    ) => {
        const response = await createReplyMutation.mutateAsync({
            commentId,
            content,
        });

        return response.status === 201;
    };

    return (
        <aside className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 shrink-0 rounded-2xl bg-slate-50 p-1">
                <div className="grid grid-cols-2 gap-1">
                    <button
                        type="button"
                        onClick={() => setMode("posts")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition ${mode === "posts"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                            }`}
                    >
                        <List className="h-3.5 w-3.5" />
                        추천 게시물
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("comment")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition ${mode === "comment"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                            }`}
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
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
                    onLoadMoreComments={() => {
                        void commentsQuery.fetchNextPage();
                    }}
                    onCreateComment={handleCreateComment}
                    onCreateReply={handleCreateReply}
                    role={role}
                />
            ) : (
                <PostRecommandPanel
                    currentPostId={postId}
                    posts={recommendationsQuery.data ?? []}
                    role={role}
                />
            )}
        </aside>
    );
}
