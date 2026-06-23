"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Flag,
    Heart,
    List,
    MessageCircle,
    Reply,
} from "lucide-react";

interface CommunityPostSideInfo {
    id: number;
    commentCount: number;
}

interface CommunitySidePost {
    id: number;
    title: string;
    authorNickname: string;
    commentCount: number;
    likeCount: number;
}

interface CommunityComment {
    id: number;
    lectureId: number;
    postId: number;
    parentId: number | null;
    authorNickname: string;
    content: string;
    createdAt: string;
}

interface PostDetailSideProps {
    post: CommunityPostSideInfo;
    sidePosts: CommunitySidePost[];
    comments: CommunityComment[];
}

type SideMode = "posts" | "comments";

export default function PostDetailSide({
    post,
    sidePosts,
    comments,
}: PostDetailSideProps) {
    const [mode, setMode] = useState<SideMode>("posts");
    const parentComments = comments.filter((comment) => comment.parentId === null);
    const getReplies = (commentId: number) =>
        comments.filter((comment) => comment.parentId === commentId);

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
                        게시글
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("comments")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition ${mode === "comments"
                            ? "bg-white text-indigo-500 shadow-sm"
                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                            }`}
                    >
                        <MessageCircle className="h-3.5 w-3.5" />
                        댓글 {post.commentCount}
                    </button>
                </div>
            </div>

            {mode === "comments" ? (
                <CommentsPanel
                    commentCount={post.commentCount}
                    parentComments={parentComments}
                    getReplies={getReplies}
                />
            ) : (
                <PostListPanel
                    currentPostId={post.id}
                    sidePosts={sidePosts}
                    onOpenComments={() => setMode("comments")}
                />
            )}
        </aside>
    );
}

function PostListPanel({
    currentPostId,
    sidePosts,
    onOpenComments,
}: {
    currentPostId: number;
    sidePosts: CommunitySidePost[];
    onOpenComments: () => void;
}) {
    return (
        <>
            <button
                type="button"
                onClick={onOpenComments}
                className="mb-3 flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl bg-indigo-500 text-xs font-black text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-600"
            >
                <MessageCircle className="h-4 w-4" />
                댓글 보기
            </button>

            <div className="mb-3 flex shrink-0 items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                    게시글 목록
                </h2>
                <Link
                    href="/student/phone/community"
                    className="text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                >
                    전체보기
                </Link>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* ==================== COMMUNITY_SIDE_POST_COMPONENT_START ==================== */}
                {/* TODO: 아래 사이드 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                {sidePosts.map((sidePost) => (
                    <Link
                        key={sidePost.id}
                        href={`/student/phone/community/${sidePost.id}`}
                        className={`block rounded-2xl border p-3 transition hover:border-indigo-100 hover:bg-indigo-50/50 ${sidePost.id === currentPostId
                            ? "border-indigo-200 bg-indigo-50"
                            : "border-slate-100 bg-white"
                            }`}
                    >
                        <p className="line-clamp-2 text-sm font-black text-slate-900">
                            {sidePost.title}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            {sidePost.authorNickname}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {sidePost.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {sidePost.commentCount}
                            </span>
                        </div>
                    </Link>
                ))}
                {/* TODO: 위 사이드 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                {/* ===================== COMMUNITY_SIDE_POST_COMPONENT_END ===================== */}
            </div>
        </>
    );
}

function CommentsPanel({
    commentCount,
    parentComments,
    getReplies,
}: {
    commentCount: number;
    parentComments: CommunityComment[];
    getReplies: (commentId: number) => CommunityComment[];
}) {
    return (
        <>
            <div className="mb-3 flex shrink-0 items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                    댓글 {commentCount}
                </h2>
                <button
                    type="button"
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white transition hover:bg-indigo-500"
                >
                    댓글 작성
                </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* ==================== COMMUNITY_COMMENT_COMPONENT_START ==================== */}
                {/* TODO: 아래 댓글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                {parentComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        replies={getReplies(comment.id)}
                    />
                ))}
                {/* TODO: 위 댓글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                {/* ===================== COMMUNITY_COMMENT_COMPONENT_END ===================== */}
            </div>
        </>
    );
}

function CommentItem({
    comment,
    replies,
}: {
    comment: CommunityComment;
    replies: CommunityComment[];
}) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <CommentHeader comment={comment} />

            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {comment.content}
            </p>

            <button
                type="button"
                className="mt-3 flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
            >
                <Reply className="h-3.5 w-3.5" />
                답글 달기
            </button>

            {replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-indigo-100 pl-3">
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="rounded-xl bg-slate-50 p-3"
                        >
                            <CommentHeader comment={reply} small />

                            <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
                                {reply.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CommentHeader({
    comment,
    small = false,
}: {
    comment: CommunityComment;
    small?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className={`${small ? "text-xs" : "text-sm"} font-black text-slate-900`}>
                    {comment.authorNickname}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                    {comment.createdAt}
                </p>
            </div>

            <button
                type="button"
                className={`${small ? "text-[11px]" : "text-xs"} flex shrink-0 items-center gap-1 font-bold text-slate-400 transition hover:text-rose-500`}
            >
                <Flag className={small ? "h-3 w-3" : "h-3.5 w-3.5"} />
                신고
            </button>
        </div>
    );
}
