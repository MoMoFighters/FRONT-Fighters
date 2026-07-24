import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Eye } from "lucide-react";

import CommunityPageHeader from "@/components/phone/community/CommunityPageHeader";
import PostDetailSide from "@/components/phone/community/PostDetailSide";
import PostRecommandPanel from "@/components/phone/community/PostRecommandPanel";
import PostLikeBtn from "@/features/post/PostLikeBtn";
import { getCommunityPostDetailAction } from "@/features/community/action";
import ExtendCommunityImage from "@/features/community/ExtendCommunityImage";
import type { CommunityAuthorRole } from "@/features/community/type";

const DEFAULT_PROFILE_IMAGE_URL =
    "https://placehold.co/80x80/e0e7ff/4f46e5?text=M";

interface GuestCommunityPostDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const getRoleLabel = (role: CommunityAuthorRole) => {
    if (role === "TEACHER") {
        return "강사";
    }

    if (role === "ADMIN") {
        return "관리자";
    }

    return "학생";
};

export default async function GuestCommunityPostDetailPage({
    params,
}: GuestCommunityPostDetailPageProps) {
    const { id } = await params;
    const postId = Number(id);

    if (!Number.isFinite(postId)) {
        notFound();
    }

    const response =
        await getCommunityPostDetailAction(postId);

    if (!response.data) {
        notFound();
    }

    const post = response.data;
    const authorProfileImageUrl =
        post.authorProfileImageUrl || DEFAULT_PROFILE_IMAGE_URL;
    const commentTotalCount = post.commentCount ?? 0;

    return (
        <div className="min-h-[calc(100vh-137px)] bg-white">
            <div className="mx-auto w-full max-w-360 px-4 py-8 md:px-12 md:py-12">
                <CommunityPageHeader role="GUEST" />
                <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-[7fr_3fr]">
                    <article className="flex min-h-[742.5px] flex-col rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-100">
                        <header className="w-full border-b border-slate-100 pb-3">
                            <div className="flex items-center justify-between gap-3">
                                <Link
                                    href="/community"
                                    className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition hover:text-indigo-500"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    목록 보기
                                </Link>
                            </div>

                            <div className="mt-2 flex min-w-0 items-center gap-2">
                                <h1 className="min-w-0 flex-1 truncate text-xl font-black tracking-tight text-slate-900">
                                    {post.title}
                                </h1>
                                <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                                    {post.category}
                                </span>
                                <span className="shrink-0 text-xs font-bold text-slate-400">
                                    {post.createdAt.slice(0, 10)}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Image
                                        src={authorProfileImageUrl}
                                        alt={`${post.authorName} profile`}
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded-full object-cover ring-1 ring-indigo-100"
                                        unoptimized
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-black text-slate-700">
                                            {post.authorName}
                                        </p>
                                        <p className="text-[11px] font-bold text-slate-400">
                                            {getRoleLabel(post.authorRole)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1" />

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        조회수 {post.viewCount}
                                    </span>
                                    <PostLikeBtn
                                        postId={post.postId}
                                        postLikeCount={post.likeCount}
                                        initialIsLiked={post.isLiked}
                                    />
                                </div>
                            </div>
                        </header>

                        <div className="pr-1">
                            <div className="flex flex-col gap-5 py-5">
                                {post.contents.map((content, index) => {
                                    if (content.type === "IMAGE") {
                                        return (
                                            <div
                                                key={`${content.type}-${index}`}
                                                className="flex justify-center"
                                            >
                                                <ExtendCommunityImage imageUrl={content.imageUrl} />
                                            </div>
                                        );
                                    }

                                    return (
                                        <p
                                            key={`${content.type}-${index}`}
                                            className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700"
                                        >
                                            {content.content}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </article>

                    <div className="flex min-h-[591px] flex-col md:sticky md:top-8">
                        <PostDetailSide
                            postId={post.postId}
                            commentTotalCount={commentTotalCount}
                            role="GUEST"
                            recommendedPanel={
                                <PostRecommandPanel postId={post.postId} role="GUEST" />
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
