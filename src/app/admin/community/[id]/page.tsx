import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Eye, Trash2 } from "lucide-react";

import PostDetailSide from "@/components/phone/community/PostDetailSide";
import PostLikeBtn from "@/features/post/PostLikeBtn";
import { getCommunityPostDetailAction } from "@/features/community/action";
import type { CommunityAuthorRole } from "@/features/community/type";

interface CommunityPostDetailPageProps {
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

export default async function CommunityPostDetailPage({
    params,
}: CommunityPostDetailPageProps) {
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

    return (
        <section className="grid h-full min-h-[calc(100vh-145px)] grid-cols-[7fr_3fr] gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <article className="flex min-h-0 flex-col rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100">
                <header className="w-full border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href="/admin/community"
                            className="inline-flex items-center gap-1 text-xs font-black text-slate-400 transition hover:text-indigo-500"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            목록 보기
                        </Link>

                        {!post.isMine ? (
                            <button
                                type="button"
                                className="cursor-pointer rounded-md border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-500 transition hover:bg-rose-50"
                                aria-label="게시글 삭제"
                                title="게시글 삭제"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        ) : (
                            <Link
                                className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
                                href={`/admin/phone/community/${post.postId}/edit`}
                            >
                                수정
                            </Link>
                        )}
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
                        <Link
                            href={post.isMine
                                ? "/admin/community/mypage"
                                : `/admin/community/user/${post.authorId}`
                            }
                            className="flex min-w-0 items-center gap-2"
                        >
                            <Image
                                src={post.authorProfileImageUrl || "https://placehold.co/80x80/e0e7ff/4f46e5?text=M"}
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
                        </Link>

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

                <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex flex-col gap-5 py-5">
                        {post.contents.map((content, index) => {
                            if (content.type === "IMAGE") {
                                return (
                                    <div
                                        key={`${content.type}-${index}`}
                                        className="flex justify-center"
                                    >
                                        <Image
                                            src={content.imageUrl}
                                            alt=""
                                            width={720}
                                            height={448}
                                            className="h-auto w-[40%] rounded-2xl object-cover shadow-sm ring-1 ring-slate-100"
                                            unoptimized
                                        />
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

            <PostDetailSide
                postId={post.postId}
                commentTotalCount={0}
                role="ADMIN"
            />
        </section>
    );
}
