import Link from "next/link";
import { Grid2X2, LayoutList, PanelsTopLeft, PenLine } from "lucide-react";
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
import type {
    CommunityAuthorRole,
    CommunityPostDashboardData,
    CommunityPostListItem,
} from "@/features/community/type";
import { getVisiblePageNumbers } from "@/lib/pagination";

export interface CommunityProfileData {
    userId: number;
    nickname: string;
    role: CommunityAuthorRole;
    profileImageUrl: string | null;
}

export interface CommunityProfilePostsPageProps {
    role?: "TEACHER" | "ADMIN";
    profile: CommunityProfileData;
    dashboard: CommunityPostDashboardData;
    posts: CommunityPostListItem[];
    selectedMode: CommunityMypagePostViewMode;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageBaseHref: string;
    detailHrefBase: string;
    actionSlot?: React.ReactNode;
}

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

const createHref = ({
    baseHref,
    mode,
    page,
}: {
    baseHref: string;
    mode: CommunityMypagePostViewMode;
    page: number;
}) => {
    const params = new URLSearchParams();

    params.set("mode", mode);
    params.set("page", String(page));

    return `${baseHref}?${params.toString()}`;
};

export const isCommunityProfileViewMode = (
    mode?: string
): mode is CommunityMypagePostViewMode => {
    return mode === "list" || mode === "grid" || mode === "card";
};

export function CommunityCreatePostLink({
    href,
}: {
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-500 px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md"
        >
            <PenLine className="h-3.5 w-3.5" />
            게시글 작성
        </Link>
    );
}

export default function CommunityProfilePostsPage({
    role,
    profile,
    dashboard,
    posts,
    selectedMode,
    currentPage,
    totalPages,
    totalCount,
    pageBaseHref,
    detailHrefBase,
    actionSlot,
}: CommunityProfilePostsPageProps) {
    const listClassName =
        selectedMode === "list"
            ? "grid grid-cols-1 gap-2"
            : selectedMode === "grid"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
                : "grid grid-cols-1 gap-3 sm:grid-cols-2";
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <div className="shrink-0 px-3 pt-3">
                <CommunitySideBar role={role} />
            </div>

            <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col p-4">
                <header className="shrink-0 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            {/* {profile.profileImageUrl ? (
                                <Image
                                    // src={profile.profileImageUrl}
                                    src={PenLine}
                                    alt={`${profile.nickname} profile`}
                                    className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-1 ring-indigo-100"
                                />
                            ) : ( */}
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50" />
                            {/* )} */}

                            <div className="min-w-0">
                                <p className="truncate text-xl font-black text-slate-900">
                                    {profile.nickname}
                                </p>
                                <p className="mt-1 w-fit rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-500">
                                    {profile.role}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/80 sm:flex-1 sm:grid-cols-4">
                            <DashboardStat
                                label="Posts"
                                value={dashboard.totalPostCount}
                            />
                            <DashboardStat
                                label="Views"
                                value={dashboard.totalViewCount}
                            />
                            <DashboardStat
                                label="Comments"
                                value={dashboard.totalCommentCount}
                            />
                            <DashboardStat
                                label="Likes"
                                value={dashboard.totalLikeCount}
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
                            총 {totalCount.toLocaleString()}개의 게시글
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {actionSlot}

                        <div className="flex rounded-2xl bg-slate-100 p-1">
                            {VIEW_MODE_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isActive = selectedMode === option.mode;

                                return (
                                    <Link
                                        key={option.mode}
                                        href={createHref({
                                            baseHref: pageBaseHref,
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

                    </div>
                </div>

                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {posts.length > 0 ? (
                        <div className={listClassName}>
                            {posts.map((post) => (
                                <CommunityMypagePostItem
                                    key={post.postId}
                                    mode={selectedMode}
                                    postId={post.postId}
                                    detailHrefBase={detailHrefBase}
                                    thumbnailImageUrl={post.thumbnailUrl}
                                    title={post.title}
                                    viewCount={post.viewCount}
                                    likeCount={post.likeCount}
                                    commentCount={post.commentCount}
                                    createdAt={post.createdAt}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm font-black text-slate-400">
                            작성한 게시글이 없습니다.
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination className="mt-3 shrink-0">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={createHref({
                                            baseHref: pageBaseHref,
                                            mode: selectedMode,
                                            page: currentPage - 1,
                                        })}
                                        text=""
                                        className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                    />
                                </PaginationItem>
                            )}

                            {pageNumbers.map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href={createHref({
                                            baseHref: pageBaseHref,
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
                                            baseHref: pageBaseHref,
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
        </div>
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
