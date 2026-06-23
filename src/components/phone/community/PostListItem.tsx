import { Eye, Heart, ImageIcon } from "lucide-react";
import Link from "next/link";
type CommunityCategory =
    | "STUDY"
    | "FASHION"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";
const CATEGORY_LABEL: Record<CommunityCategory, string> = {
    STUDY: "학습",
    FASHION: "패션",
    BEAUTY: "뷰티",
    FITNESS: "피트니스",
    COOK: "요리",
    FREE: "자유",
};


export default function PostListItem({ id, thumbnailUrl, title, category, likeCount, viewCount, authorNickname }: {
    id: number;
    thumbnailUrl: string;
    title: string;
    category: CommunityCategory;
    likeCount: number;
    viewCount: number;
    authorNickname: string;
}) {
    return (
        <Link
            key={id}
            href={`/student/phone/community/${id}`}
            className="flex flex-col h-50 group overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative h-32.5 bg-slate-100">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`${title} 썸네일`}
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

            <div className="p-3 h-17.5">
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

                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                    {authorNickname}
                </p>
            </div>
        </Link>
    );
}