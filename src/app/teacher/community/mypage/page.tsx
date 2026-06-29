import Link from "next/link";
import { Grid2X2, LayoutList, PanelsTopLeft, UserPlus } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import CommunityMypagePostItem, {
    type CommunityMypagePostViewMode,
} from "@/components/phone/community/CommunityMypagePostItem";

interface CommunityMyPageProps {
    searchParams: Promise<{
        mode?: CommunityMypagePostViewMode;
        page?: string;
    }>;
}

interface CommunityMypageProfile {
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    profileImageUrl: string | null;
    totalPostCount: number;
    totalViewCount: number;
    totalCommentCount: number;
    totalLikeCount: number;
}

interface CommunityMypagePost {
    postId: number;
    thumbnailImageUrl: string | null;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
}

const PROFILE: CommunityMypageProfile = {
    userId: 1,
    nickname: "Momo Writer",
    role: "STUDENT",
    profileImageUrl: "https://placehold.co/120x120/e0e7ff/4f46e5?text=M",
    totalPostCount: 28,
    totalViewCount: 1284,
    totalCommentCount: 136,
    totalLikeCount: 312,
};

const POSTS: CommunityMypagePost[] = [
    {
        postId: 1,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=420&q=80",
        title: "Java study review after today's class",
        viewCount: 128,
        likeCount: 24,
        commentCount: 15,
        createdAt: "2026-06-18T13:00:00.000000Z",
    },
    {
        postId: 2,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=420&q=80",
        title: "First fitness routine notes",
        viewCount: 98,
        likeCount: 18,
        commentCount: 6,
        createdAt: "2026-06-17T09:24:00.000000Z",
    },
    {
        postId: 3,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=420&q=80",
        title: "Small tips from cooking class",
        viewCount: 76,
        likeCount: 19,
        commentCount: 8,
        createdAt: "2026-06-16T18:10:00.000000Z",
    },
    {
        postId: 4,
        thumbnailImageUrl: null,
        title: "A small note from today",
        viewCount: 44,
        likeCount: 7,
        commentCount: 5,
        createdAt: "2026-06-15T20:00:00.000000Z",
    },
    {
        postId: 5,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=420&q=80",
        title: "Drawing practice log",
        viewCount: 112,
        likeCount: 31,
        commentCount: 4,
        createdAt: "2026-06-14T10:30:00.000000Z",
    },
    {
        postId: 6,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=420&q=80",
        title: "Closet cleanup memo",
        viewCount: 63,
        likeCount: 16,
        commentCount: 3,
        createdAt: "2026-06-13T16:45:00.000000Z",
    },
    {
        postId: 7,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=420&q=80",
        title: "Beauty care routine I want to keep",
        viewCount: 91,
        likeCount: 27,
        commentCount: 7,
        createdAt: "2026-06-12T08:00:00.000000Z",
    },
    {
        postId: 8,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=420&q=80",
        title: "Weekend lecture recommendation",
        viewCount: 57,
        likeCount: 12,
        commentCount: 2,
        createdAt: "2026-06-11T21:10:00.000000Z",
    },
    {
        postId: 9,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=420&q=80",
        title: "Salad making success note",
        viewCount: 143,
        likeCount: 35,
        commentCount: 11,
        createdAt: "2026-06-10T12:40:00.000000Z",
    },
    {
        postId: 10,
        thumbnailImageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=420&q=80",
        title: "Morning stretching record",
        viewCount: 84,
        likeCount: 21,
        commentCount: 6,
        createdAt: "2026-06-09T07:30:00.000000Z",
    },
];

const PAGE_SIZE = 8;

const VIEW_MODE_OPTIONS: {
    mode: CommunityMypagePostViewMode;
    label: string;
    icon: typeof LayoutList;
}[] = [
        {
            mode: "list",
            label: "List",
            icon: LayoutList,
        },
        {
            mode: "grid",
            label: "Grid",
            icon: Grid2X2,
        },
        {
            mode: "card",
            label: "Card",
            icon: PanelsTopLeft,
        },
    ];

const isViewMode = (mode?: string): mode is CommunityMypagePostViewMode => {
    return mode === "list" || mode === "grid" || mode === "card";
};

const createHref = ({
    mode,
    page,
}: {
    mode: CommunityMypagePostViewMode;
    page: number;
}) => {
    const params = new URLSearchParams();

    params.set("mode", mode);
    params.set("page", String(page));

    return `/teacher/community/mypage?${params.toString()}`;
};

export default async function CommunityMyPage({
    searchParams,
}: CommunityMyPageProps) {
    const { mode, page } = await searchParams;
    const selectedMode = isViewMode(mode) ? mode : "grid";
    const totalPages = Math.max(Math.ceil(POSTS.length / PAGE_SIZE), 1);
    const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const posts = POSTS.slice(startIndex, startIndex + PAGE_SIZE);

    const listClassName =
        selectedMode === "list"
            ? "grid grid-cols-1 gap-2"
            : selectedMode === "grid"
                ? "grid grid-cols-4 gap-3"
                : "grid grid-cols-2 gap-3";

    return (
        <div className="flex h-full min-h-0 flex-row overflow-hidden bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <CommunitySideBar role="TEACHER" />

            <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col p-4">
                <header className="shrink-0 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-3">
                            {PROFILE.profileImageUrl ? (
                                <img
                                    src={PROFILE.profileImageUrl}
                                    alt={`${PROFILE.nickname} profile`}
                                    className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-1 ring-indigo-100"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-2xl bg-indigo-50" />
                            )}

                            <div className="min-w-0">
                                <p className="truncate text-xl font-black text-slate-900">
                                    {PROFILE.nickname}
                                </p>
                                <p className="mt-1 w-fit rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                                    {PROFILE.role}
                                </p>
                            </div>
                        </div>

                        <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80">
                            <DashboardStat
                                label="Posts"
                                value={PROFILE.totalPostCount}
                            />
                            <DashboardStat
                                label="Views"
                                value={PROFILE.totalViewCount}
                            />
                            <DashboardStat
                                label="Comments"
                                value={PROFILE.totalCommentCount}
                            />
                            <DashboardStat
                                label="Likes"
                                value={PROFILE.totalLikeCount}
                            />
                        </div>
                    </div>
                </header>

                <div className="mt-4 flex shrink-0 items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">
                            작성한 게시글
                        </h2>
                        <p className="mt-0.5 text-xs font-bold text-slate-400">
                            총 {POSTS.length}개의 게시글
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex rounded-2xl bg-slate-100 p-1">
                            {VIEW_MODE_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isActive = selectedMode === option.mode;

                                return (
                                    <Link
                                        key={option.mode}
                                        href={createHref({
                                            mode: option.mode,
                                            page: 1,
                                        })}
                                        className={`flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-[11px] font-black transition ${isActive
                                            ? "bg-white text-indigo-500 shadow-sm"
                                            : "text-slate-400 hover:bg-white/70 hover:text-slate-700"
                                            }`}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {option.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className="cursor-pointer flex h-9 items-center gap-1.5 rounded-xl bg-indigo-500 px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md"
                        >
                            <Link href="/teacher/community/create">
                                게시글 작성
                            </Link>
                        </button>
                    </div>
                </div>

                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className={listClassName}>
                        {posts.map((post) => (
                            <CommunityMypagePostItem
                                key={post.postId}
                                mode={selectedMode}
                                postId={post.postId}
                                thumbnailImageUrl={post.thumbnailImageUrl}
                                title={post.title}
                                viewCount={post.viewCount}
                                likeCount={post.likeCount}
                                commentCount={post.commentCount}
                                createdAt={post.createdAt}
                            />
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Pagination className="mt-3 shrink-0">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={createHref({
                                            mode: selectedMode,
                                            page: currentPage - 1,
                                        })}
                                        text=""
                                        className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                    />
                                </PaginationItem>
                            )}

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href={createHref({
                                            mode: selectedMode,
                                            page: pageNumber,
                                        })}
                                        isActive={currentPage === pageNumber}
                                        className={
                                            currentPage === pageNumber
                                                ? "h-8 w-8 border-indigo-300 bg-indigo-50 text-indigo-500 hover:bg-indigo-50"
                                                : "h-8 w-8 text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                        }
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={createHref({
                                            mode: selectedMode,
                                            page: currentPage + 1,
                                        })}
                                        text=""
                                        className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </section>
        </div >
    );
}

function DashboardStat({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="border-r border-white px-3 py-3 text-center last:border-r-0">
            <p className="text-[11px] font-black text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
                {value.toLocaleString()}
            </p>
        </div>
    );
}
