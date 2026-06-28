import { Eye, Heart, ImageIcon, UserRound } from "lucide-react";
import Link from "next/link";

type CommunityCategory =
    | "STUDY"
    | "ART"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

const CATEGORY_LABEL: Record<CommunityCategory, string> = {
    STUDY: "학습",
    ART: "예술",
    BEAUTY: "뷰티",
    FITNESS: "피트니스",
    COOK: "요리",
    FREE: "자유",
};

export default function PostListItem({
    id,
    thumbnailUrl,
    title,
    category,
    likeCount,
    viewCount,
    authorNickname,
    authorProfileImageUrl,
    role,
}: {
    id: number;
    thumbnailUrl: string | null;
    title: string;
    category: CommunityCategory;
    likeCount: number;
    viewCount: number;
    authorNickname: string;
    authorProfileImageUrl?: string | null;
    role?: "TEACHER" | 'ADMIN';
}) {

    const getBaseUrl = () => {
        if (role === "TEACHER") return "/teacher/community";
        if (role === "ADMIN") return "/admin/community";
        return "/student/phone/community"; // 기본값(학생)
    };
    return (
        <Link
            key={id}
            href={`${getBaseUrl()}/${id}`}
            className="group flex h-50 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative h-32.5 bg-slate-100">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`${title} thumbnail`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                )}

                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-indigo-500 shadow-sm">
                    {CATEGORY_LABEL[category]}
                </span>
            </div>

            <div className="h-17.5 p-3">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-sm font-black text-slate-900">
                        {title}
                    </h2>

                    <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[11px] font-bold text-slate-700">
                        <Heart className="h-3 w-3 fill-current text-rose-400" />
                        {likeCount}
                        <Eye className="ml-0.5 h-3 w-3" />
                        {viewCount}
                    </span>
                </div>

                <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-400 ring-1 ring-indigo-100">
                        {authorProfileImageUrl ? (
                            <img
                                src={authorProfileImageUrl}
                                alt={`${authorNickname} profile`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound className="h-3.5 w-3.5" />
                        )}
                    </div>
                    <p className="line-clamp-1 text-xs font-bold leading-5 text-slate-500">
                        {authorNickname}
                    </p>
                </div>
            </div>
        </Link>
    );
}

