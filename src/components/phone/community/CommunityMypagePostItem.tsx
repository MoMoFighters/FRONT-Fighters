import Link from "next/link";
import { Eye, Heart, ImageIcon, MessageCircle } from "lucide-react";

export type CommunityMypagePostViewMode = "list" | "grid" | "card";

export interface CommunityMypagePostItemProps {
    mode: CommunityMypagePostViewMode;
    postId: number;
    detailHrefBase?: string;
    thumbnailImageUrl: string | null;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

function Thumbnail({
    thumbnailImageUrl,
    title,
    className,
}: {
    thumbnailImageUrl: string | null;
    title: string;
    className: string;
}) {
    if (!thumbnailImageUrl) {
        return (
            <div className={`${className} flex items-center justify-center bg-indigo-50 text-indigo-200`}>
                <ImageIcon className="h-6 w-6" />
            </div>
        );
    }

    return (
        <img
            src={thumbnailImageUrl}
            alt={`${title} thumbnail`}
            className={`${className} object-cover`}
        />
    );
}

function PostStats({
    viewCount,
    commentCount,
    likeCount,
    className = "",
}: {
    viewCount: number;
    commentCount: number;
    likeCount: number;
    className?: string;
}) {
    return (
        <div className={`flex items-center gap-3 text-[11px] font-black ${className}`}>
            <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {viewCount}
            </span>
            <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {commentCount}
            </span>
            <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {likeCount}
            </span>
        </div>
    );
}

export default function CommunityMypagePostItem({
    mode,
    postId,
    detailHrefBase = "/student/phone/community",
    thumbnailImageUrl,
    title,
    viewCount,
    likeCount,
    commentCount,
    createdAt,
}: CommunityMypagePostItemProps) {
    const detailHref = `${detailHrefBase}/${postId}`;

    if (mode === "grid") {
        return (
            <Link
                href={detailHref}
                className="group relative block aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <Thumbnail
                    thumbnailImageUrl={thumbnailImageUrl}
                    title={title}
                    className="h-full w-full transition duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 flex flex-col justify-between bg-slate-950/0 p-3 opacity-0 transition group-hover:bg-slate-950/45 group-hover:opacity-100">
                    <div>
                        <p className="line-clamp-2 text-sm font-black leading-5 text-white">
                            {title}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-white/75">
                            {createdAt.slice(0, 10)}
                        </p>
                    </div>

                    <PostStats
                        viewCount={viewCount}
                        commentCount={commentCount}
                        likeCount={likeCount}
                        className="text-white"
                    />
                </div>
            </Link>
        );
    }

    if (mode === "card") {
        return (
            <Link
                href={detailHref}
                className="grid min-h-28 grid-cols-[116px_1fr] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <Thumbnail
                    thumbnailImageUrl={thumbnailImageUrl}
                    title={title}
                    className="h-full min-h-28 w-full"
                />

                <div className="flex min-w-0 flex-col justify-between p-3">
                    <div>
                        <p className="line-clamp-2 text-sm font-black leading-5 text-slate-900">
                            {title}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-slate-400">
                            {createdAt.slice(0, 10)}
                        </p>
                    </div>

                    <PostStats
                        viewCount={viewCount}
                        commentCount={commentCount}
                        likeCount={likeCount}
                        className="text-slate-400"
                    />
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={detailHref}
            className="grid h-[52px] grid-cols-[52px_1fr_auto_auto_auto] items-center gap-3 rounded-2xl bg-white px-2.5 py-2 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-indigo-50/60 hover:shadow-md"
        >
            <Thumbnail
                thumbnailImageUrl={thumbnailImageUrl}
                title={title}
                className="h-9 w-9 rounded-xl"
            />

            <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                    {title}
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                    {createdAt.slice(0, 10)}
                </p>
            </div>

            <span className="flex min-w-10 items-center gap-1 text-[11px] font-black text-slate-400">
                <Eye className="h-3.5 w-3.5" />
                {viewCount}
            </span>
            <span className="flex min-w-10 items-center gap-1 text-[11px] font-black text-slate-400">
                <MessageCircle className="h-3.5 w-3.5" />
                {commentCount}
            </span>
            <span className="flex min-w-10 items-center gap-1 text-[11px] font-black text-slate-400">
                <Heart className="h-3.5 w-3.5" />
                {likeCount}
            </span>
        </Link>
    );
}
