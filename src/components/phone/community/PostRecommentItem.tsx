import Link from "next/link";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { PostRecommentItemProps } from "./PostDetailSide";

const DEFAULT_THUMBNAIL_URL = "https://placehold.co/360x240/e0e7ff/4f46e5?text=MOMO";

export default function PostRecommentItem({
    postId,
    thumbnailUrl,
    category,
    createdAt,
    title,
    authorName,
    viewCount,
    likeCount,
    commentCount,
    isActive = false,
}: PostRecommentItemProps) {
    return (
        <Link
            href={`/student/phone/community/${postId}`}
            className={`grid grid-cols-[72px_1fr] gap-3 rounded-2xl border p-2.5 transition hover:border-indigo-100 hover:bg-indigo-50/50 ${isActive
                ? "border-indigo-200 bg-indigo-50"
                : "border-slate-100 bg-white"
                }`}
        >
            <img
                src={thumbnailUrl ?? DEFAULT_THUMBNAIL_URL}
                alt=""
                className="h-[72px] w-[72px] rounded-xl object-cover"
            />

            <div className="min-w-0">
                <div className="mb-1 flex items-center gap-1.5">
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black text-indigo-500">
                        {category}
                    </span>
                    <span className="truncate text-[10px] font-bold text-slate-400">
                        {createdAt.slice(0, 10)}
                    </span>
                </div>

                <p className="line-clamp-2 text-sm font-black leading-5 text-slate-900">
                    {title}
                </p>
                <p className="mt-1 truncate text-[11px] font-bold text-slate-400">
                    {authorName}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {viewCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                        <Heart className="h-3 w-3" />
                        {likeCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                        <MessageCircle className="h-3 w-3" />
                        {commentCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
