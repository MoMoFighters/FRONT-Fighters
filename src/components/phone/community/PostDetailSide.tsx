"use client";

import { useEffect, useState } from "react";
import { List, MessageCircle } from "lucide-react";
import PostCommentsPanel from "./PostCommentsPanel";
import PostRecommandPanel from "./PostRecommandPanel";
import {
    createCommunityPostCommentAction,
    createCommunityPostReplyAction,
    getCommunityPostCommentsAction,
    getCommunityPostRecommendationsAction,
    getCommunityPostRepliesAction,
} from "@/features/community/action";
import type {
    CommunityPostCommentItem,
    CommunityPostReplyItem,
    CommunityRecommendedPostItem,
} from "@/features/community/type";

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
}

export interface ReplyPageState {
    totalCount: number;
    nextCursor: number | null;
    hasMore: boolean;
}

export interface CommentPageState {
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

export interface CommentPageResponse extends CommentPageState {
    comments: CommunityComment[];
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
}

export interface PostRecommandPanelProps {
    currentPostId: number;
    posts: RecommendedPost[];
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
    onLoadMoreComments: () => void;
    repliesByCommentId: Record<number, ReplyPageState>;
    onLoadMoreReplies: (commentId: number) => void;
    onCreateComment: (content: string) => Promise<boolean>;
    onCreateReply: (
        commentId: number,
        content: string
    ) => Promise<boolean>;
}

interface PostDetailSideProps {
    postId: number;
    commentTotalCount?: number;
}

const DUMMY_RECOMMENDED_POSTS: RecommendedPost[] = [
    {
        postId: 1,
        title: "자바 스터디 후기",
        category: "STUDY",
        viewCount: 10,
        likeCount: 5,
        commentCount: 3,
        thumbnailUrl: null,
        authorName: "홍길동",
        authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=홍",
        authorRole: "STUDENT",
        createdAt: "2026-06-18T13:00:00.000000Z",
    },
    {
        postId: 2,
        title: "첫 운동 루틴 기록",
        category: "FITNESS",
        viewCount: 32,
        likeCount: 11,
        commentCount: 4,
        thumbnailUrl: "https://placehold.co/360x240/dbeafe/2563eb?text=운동",
        authorName: "모모러너",
        authorProfileImageUrl: "https://placehold.co/80x80/dbeafe/2563eb?text=러",
        authorRole: "STUDENT",
        createdAt: "2026-06-17T09:24:00.000000Z",
    },
    {
        postId: 3,
        title: "요리 수업에서 배운 작은 팁",
        category: "COOK",
        viewCount: 28,
        likeCount: 9,
        commentCount: 2,
        thumbnailUrl: "https://placehold.co/360x240/fef3c7/d97706?text=요리",
        authorName: "복숭아식탁",
        authorProfileImageUrl: "https://placehold.co/80x80/fef3c7/d97706?text=요",
        authorRole: "STUDENT",
        createdAt: "2026-06-16T18:10:00.000000Z",
    },
    {
        postId: 4,
        title: "오늘의 짧은 기록",
        category: "FREE",
        viewCount: 14,
        likeCount: 7,
        commentCount: 5,
        thumbnailUrl: null,
        authorName: "도시산책",
        authorProfileImageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=산",
        authorRole: "STUDENT",
        createdAt: "2026-06-15T20:00:00.000000Z",
    },
];

const DUMMY_COMMENT_PAGES: CommentPageResponse[] = [
    {
        totalElements: 7,
        totalPages: 2,
        currentPage: 0,
        comments: [
            {
                commentId: 1,
                content: "도움 되는 글 감사합니다.",
                authorName: "홍길동",
                authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=홍",
                authorRole: "STUDENT",
                authorId: 1,
                parentId: null,
                createdAt: "2026-06-18T13:20:00.000000Z",
                isMine: false,
                isWriter: false,
            },
            {
                commentId: 2,
                content: "저도 자바 공부 중이라서 정말 유용했어요.",
                authorName: "코드피치",
                authorProfileImageUrl: "https://placehold.co/80x80/fce7f3/be185d?text=피",
                authorRole: "STUDENT",
                authorId: 2,
                parentId: null,
                createdAt: "2026-06-18T13:30:00.000000Z",
                isMine: false,
                isWriter: false,
            },
            {
                commentId: 3,
                content: "감사합니다. 다음에는 예제 코드도 같이 정리해볼게요.",
                authorName: "홍길동",
                authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=홍",
                authorRole: "STUDENT",
                authorId: 3,
                parentId: 2,
                createdAt: "2026-06-18T13:35:00.000000Z",
                isMine: true,
                isWriter: true,
            },
            {
                commentId: 4,
                content: "저는 클래스랑 객체 부분이 제일 어렵더라구요.",
                authorName: "스터디메이트",
                authorProfileImageUrl: "https://placehold.co/80x80/dcfce7/16a34a?text=스",
                authorRole: "STUDENT",
                authorId: 4,
                parentId: null,
                createdAt: "2026-06-18T14:00:00.000000Z",
                isMine: false,
                isWriter: false,
            },
        ],
    },
    {
        totalElements: 7,
        totalPages: 2,
        currentPage: 1,
        comments: [
            {
                commentId: 5,
                content: "이 글 보고 기본기부터 다시 복습하고 싶어졌어요.",
                authorName: "모모학생",
                authorProfileImageUrl: "https://placehold.co/80x80/fae8ff/a21caf?text=모",
                authorRole: "STUDENT",
                authorId: 5,
                parentId: null,
                createdAt: "2026-06-18T14:20:00.000000Z",
                isMine: false,
                isWriter: false,
            },
            {
                commentId: 6,
                content: "예제는 직접 따라 쳐보는 게 확실히 도움이 많이 됩니다.",
                authorName: "홍길동",
                authorProfileImageUrl: "https://placehold.co/80x80/e0e7ff/4f46e5?text=홍",
                authorRole: "STUDENT",
                authorId: 6,
                parentId: 5,
                createdAt: "2026-06-18T14:25:00.000000Z",
                isMine: true,
                isWriter: true,
            },
            {
                commentId: 7,
                content: "다음 후기글도 기다리고 있을게요.",
                authorName: "새싹개발자",
                authorProfileImageUrl: "https://placehold.co/80x80/dcfce7/15803d?text=새",
                authorRole: "STUDENT",
                authorId: 7,
                parentId: null,
                createdAt: "2026-06-18T15:00:00.000000Z",
                isMine: false,
                isWriter: false,
            },
        ],
    },
];

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
});

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

export default function PostDetailSide({
    postId,
    commentTotalCount,
}: PostDetailSideProps) {
    const [mode, setMode] = useState<SideMode>("posts");
    const [recommendedPosts, setRecommendedPosts] = useState<RecommendedPost[] | null>(null);
    const [comments, setComments] = useState<CommunityComment[]>([]);
    const [commentPage, setCommentPage] = useState<CommentPageState | null>(null);
    const [repliesByCommentId, setRepliesByCommentId] =
        useState<Record<number, ReplyPageState>>({});

    useEffect(() => {
        if (mode === "posts" && recommendedPosts === null) {
            fetchRecommendedPosts();
        }

        if (mode === "comment" && commentPage === null) {
            fetchComments(null);
        }
    }, [mode, recommendedPosts, commentPage]);

    const fetchRecommendedPosts = async () => {
        const response =
            await getCommunityPostRecommendationsAction(postId);

        const recommendations = response.data
            ? [
                ...response.data.topPosts,
                ...response.data.authorPosts,
            ].map(mapRecommendedPost)
            : [];

        setRecommendedPosts(recommendations);
    };

    const fetchComments = async (cursor: number | null) => {
        const response = await getCommunityPostCommentsAction({
            postId,
            cursor,
            size: 10,
        });

        if (!response.data) {
            return;
        }

        const nextComments: CommunityComment[] = response.data.comments.flatMap(
            (comment) => [
                mapComment(comment),
                ...(comment.replies ?? []).map((reply) =>
                    mapReply(reply, comment.commentId)
                ),
            ]
        );

        setComments((prev) => [...prev, ...nextComments]);
        setCommentPage({
            totalElements: response.data.totalCount,
            totalPages: response.data.nextCursor === null ? 0 : 1,
            currentPage: response.data.nextCursor ?? -1,
        });

        setRepliesByCommentId((prev) => {
            const next = { ...prev };

            response.data?.comments.forEach((comment) => {
                next[comment.commentId] = {
                    totalCount: comment.replies?.length ?? 0,
                    nextCursor: comment.nextReplyCursor ?? null,
                    hasMore: Boolean(comment.hasMoreReplies),
                };
            });

            return next;
        });
    };

    const handleLoadMoreComments = () => {
        if (!commentPage) {
            return;
        }

        fetchComments(commentPage.currentPage);
    };

    const handleLoadMoreReplies = async (commentId: number) => {
        const replyState = repliesByCommentId[commentId];

        if (!replyState?.hasMore) {
            return;
        }

        const response = await getCommunityPostRepliesAction({
            postId,
            commentId,
            cursor: replyState.nextCursor,
            size: 5,
        });

        if (!response.data) {
            return;
        }

        const replyData = response.data;

        setComments((prev) => [
            ...prev,
            ...replyData.replies.map((reply) =>
                mapReply(reply, commentId)
            ),
        ]);

        setRepliesByCommentId((prev) => ({
            ...prev,
            [commentId]: {
                totalCount: replyData.totalCount,
                nextCursor: replyData.nextCursor,
                hasMore: replyData.nextCursor !== null,
            },
        }));
    };

    const resetComments = async () => {
        setComments([]);
        setCommentPage(null);
        setRepliesByCommentId({});
        await fetchComments(null);
    };

    const handleCreateComment = async (content: string) => {
        const response = await createCommunityPostCommentAction({
            postId,
            content,
        });

        if (response.status !== 201) {
            return false;
        }

        await resetComments();
        return true;
    };

    const handleCreateReply = async (
        commentId: number,
        content: string
    ) => {
        const response = await createCommunityPostReplyAction({
            postId,
            commentId,
            content,
        });

        if (response.status !== 201) {
            return false;
        }

        await resetComments();
        return true;
    };

    const displayCommentTotalCount = commentPage?.totalElements ?? commentTotalCount ?? 0;
    const hasNextCommentPage = commentPage
        ? commentPage.currentPage !== -1
        : false;

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
                    hasNextCommentPage={hasNextCommentPage}
                    onLoadMoreComments={handleLoadMoreComments}
                    repliesByCommentId={repliesByCommentId}
                    onLoadMoreReplies={handleLoadMoreReplies}
                    onCreateComment={handleCreateComment}
                    onCreateReply={handleCreateReply}
                />
            ) : (
                <PostRecommandPanel
                    currentPostId={postId}
                    posts={recommendedPosts ?? []}
                />
            )}
        </aside>
    );
}
