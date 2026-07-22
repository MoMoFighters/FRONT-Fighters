import Link from "next/link";
import { Grid2X2, LayoutList, PanelsTopLeft, Search } from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import CommunityMypagePostItem, {
    type CommunityMypagePostViewMode,
} from "@/components/phone/community/CommunityMypagePostItem";
import type {
    CommunityAuthorRole,
    CommunityCategory,
    CommunityPostListItem,
} from "@/features/community/type";
import { getVisiblePageNumbers } from "@/lib/pagination";

export const COMMUNITY_ROOT_PAGE_SIZE = 10;

export const CATEGORY_OPTIONS: {
    value: CommunityCategory | "ALL";
    label: string;
}[] = [
        { value: "ALL", label: "전체" },
        { value: "ART", label: "예술" },
        { value: "STUDY", label: "학습" },
        { value: "BEAUTY", label: "뷰티" },
        { value: "FITNESS", label: "피트니스" },
        { value: "COOK", label: "요리" },
        { value: "FREE", label: "자유" },
    ];

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

export const isCommunityCategory = (
    category?: string
): category is CommunityCategory => {
    return CATEGORY_OPTIONS.some(
        (option) => option.value === category && option.value !== "ALL"
    );
};

export const isCommunityRootViewMode = (
    mode?: string
): mode is CommunityMypagePostViewMode => {
    return mode === "list" || mode === "grid" || mode === "card";
};

const createHref = ({
    baseHref,
    page,
    category,
    keyword,
    mode,
}: {
    baseHref: string;
    page: number;
    category: CommunityCategory | "ALL";
    keyword?: string;
    mode: CommunityMypagePostViewMode;
}) => {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    }

    if (category !== "ALL") {
        params.set("category", category);
    }

    if (mode !== "grid") {
        params.set("mode", mode);
    }

    if (page > 1) {
        params.set("cursor", String((page - 1) * COMMUNITY_ROOT_PAGE_SIZE));
    }

    const queryString = params.toString();

    return `${baseHref}${queryString ? `?${queryString}` : ""}`;
};

interface CommunityRootPostsPageProps {
    role?: CommunityAuthorRole;
    baseHref: string;
    detailHrefBase: string;
    posts: CommunityPostListItem[];
    selectedCategory: CommunityCategory | "ALL";
    selectedMode: CommunityMypagePostViewMode;
    searchKeyword: string;
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export default function CommunityRootPostsPage({
    role,
    baseHref,
    detailHrefBase,
    posts,
    selectedCategory,
    selectedMode,
    searchKeyword,
    currentPage,
    totalPages,
    totalCount,
}: CommunityRootPostsPageProps) {
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);
    const listClassName =
        selectedMode === "list"
            ? "grid grid-cols-1 gap-2"
            : selectedMode === "grid"
                ? "grid grid-cols-5 gap-3"
                : "grid grid-cols-2 gap-3";

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <div className="shrink-0 px-3 pt-3">
                {role !== 'ADMIN' && role !== 'GUEST' &&
                    <CommunitySideBar role={role === "STUDENT" ? undefined : role} />
                }
            </div>

            <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col px-4 py-3">
                <header className="shrink-0">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                                커뮤니티
                            </h1>
                            <p className="mt-0.5 text-xs font-bold text-slate-400">
                                모모시티 친구들과 이야기를 나눠보세요. 게시글 {totalCount.toLocaleString()}개
                            </p>
                        </div>

                        <div className="flex rounded-2xl bg-slate-100 p-1">
                            {VIEW_MODE_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isActive = selectedMode === option.mode;

                                return (
                                    <Link
                                        key={option.mode}
                                        href={createHref({
                                            baseHref,
                                            page: 1,
                                            category: selectedCategory,
                                            keyword: searchKeyword,
                                            mode: option.mode,
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

                    <form
                        action={baseHref}
                        className="mt-3 flex items-center gap-2"
                    >
                        {selectedMode !== "grid" && (
                            <input
                                type="hidden"
                                name="mode"
                                value={selectedMode}
                            />
                        )}

                        <div className="relative min-w-0 flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                name="keyword"
                                placeholder="검색어를 입력하세요"
                                defaultValue={searchKeyword}
                                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-bold text-slate-500 outline-none"
                            />
                        </div>

                        <Select
                            name="category"
                            defaultValue={selectedCategory}
                        >
                            <SelectTrigger className="h-9 w-28 rounded-xl border-slate-200 bg-white text-sm font-bold text-slate-600">
                                <SelectValue placeholder="카테고리" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <button
                            type="submit"
                            className="h-9 cursor-pointer rounded-xl bg-indigo-400 px-3 py-2 text-sm font-black text-white transition hover:bg-indigo-500"
                        >
                            조회
                        </button>
                    </form>
                </header>

                <div className="mt-4 min-h-0 flex-1 overflow-y-auto border-b border-slate-300 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                        <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                            <Search className="h-9 w-9 text-slate-300" />
                            <p className="mt-3 text-sm font-black text-slate-600">
                                게시글이 없습니다.
                            </p>
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
                                            baseHref,
                                            page: currentPage - 1,
                                            category: selectedCategory,
                                            keyword: searchKeyword,
                                            mode: selectedMode,
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
                                            baseHref,
                                            page: pageNumber,
                                            category: selectedCategory,
                                            keyword: searchKeyword,
                                            mode: selectedMode,
                                        })}
                                        isActive={pageNumber === currentPage}
                                        className={
                                            pageNumber === currentPage
                                                ? "h-8 w-8 border-indigo-300 bg-indigo-50 p-0 text-xs font-black text-indigo-500 hover:bg-indigo-50"
                                                : "h-8 w-8 border border-slate-200 p-0 text-xs font-black text-slate-500 hover:bg-white hover:text-slate-900"
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
                                            baseHref,
                                            page: currentPage + 1,
                                            category: selectedCategory,
                                            keyword: searchKeyword,
                                            mode: selectedMode,
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
