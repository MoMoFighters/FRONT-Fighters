import { Search } from "lucide-react";

import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import PostListItem from "@/components/phone/community/PostListItem";
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
import {
    getCommunityPostListAction,
    searchCommunityPostAction,
} from "@/features/community/action";
import type { CommunityCategory } from "@/features/community/type";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface CommunityPageProps {
    searchParams: Promise<{
        category?: CommunityCategory | "ALL";
        cursor?: string;
        keyword?: string;
    }>;
}

const PAGE_SIZE = 12;

const CATEGORY_OPTIONS: { value: CommunityCategory | "ALL"; label: string; }[] = [
    { value: "ALL", label: "전체" },
    { value: "ART", label: "예술" },
    { value: "STUDY", label: "학습" },
    { value: "BEAUTY", label: "뷰티" },
    { value: "FITNESS", label: "피트니스" },
    { value: "COOK", label: "요리" },
    { value: "FREE", label: "자유" },
];

const isCommunityCategory = (
    category?: string
): category is CommunityCategory => {
    return CATEGORY_OPTIONS.some(
        (option) => option.value === category && option.value !== "ALL"
    );
};

const createPageHref = ({
    page,
    category,
    keyword,
}: {
    page: number;
    category: CommunityCategory | "ALL";
    keyword?: string;
}) => {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    }

    if (category !== "ALL") {
        params.set("category", category);
    }

    if (page > 1) {
        params.set("cursor", String((page - 1) * PAGE_SIZE));
    }

    const queryString = params.toString();

    return `/student/community${queryString ? `?${queryString}` : ""}`;
};

export default async function CommunityPage({
    searchParams,
}: CommunityPageProps) {
    const {
        category = "ALL",
        cursor,
        keyword,
    } = await searchParams;

    const selectedCategory =
        isCommunityCategory(category)
            ? category
            : "ALL";
    const requestedCursor =
        cursor !== undefined && cursor !== ""
            ? Number(cursor)
            : null;
    const validCursor =
        typeof requestedCursor === "number" && Number.isFinite(requestedCursor)
            ? requestedCursor
            : null;
    const searchKeyword = keyword?.trim() ?? "";

    const requestParams = {
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
        cursor: validCursor,
        size: PAGE_SIZE,
    };
    const response = searchKeyword
        ? await searchCommunityPostAction({
            ...requestParams,
            keyword: searchKeyword,
        })
        : await getCommunityPostListAction(requestParams);

    if (response.status >= 400) {
        console.warn("[community] post list failed", response);
    }

    const pageData = response.data ?? {
        posts: [],
        totalCount: 0,
        nextCursor: null,
    };
    const posts = pageData.posts ?? [];
    const totalCount =
        pageData.totalCount ?? pageData.totalElements ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage =
        validCursor !== null
            ? Math.floor(validCursor / PAGE_SIZE) + 1
            : 1;
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);

    return (
        <div className="flex h-full min-h-0 flex-row overflow-hidden bg-white/80 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <CommunitySideBar />

            <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col px-3 py-2">
                <header className="shrink-0">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                                커뮤니티
                            </h1>
                            <p className="mt-0.5 text-xs font-bold text-slate-400">
                                모모시티 친구들과 이야기를 나눠보세요.
                            </p>
                        </div>

                        <p className="text-xs font-bold text-slate-400">
                            게시글 {totalCount}개
                        </p>
                    </div>

                    <form
                        action="/student/community"
                        className="mt-3 flex items-center gap-2"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                name="keyword"
                                placeholder="검색어를 입력하세요"
                                defaultValue={searchKeyword}
                                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-400 outline-none"
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
                        <div className="grid grid-cols-4 gap-8">
                            {posts.map((post) => (
                                <PostListItem
                                    key={post.postId}
                                    id={post.postId}
                                    thumbnailUrl={post.thumbnailUrl}
                                    title={post.title}
                                    category={post.category}
                                    likeCount={post.likeCount}
                                    authorNickname={post.authorName}
                                    authorProfileImageUrl={post.authorProfileImageUrl}
                                    viewCount={post.viewCount}
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

                    {totalPages > 1 && (
                        <div className="mr-[63px] mt-5">
                            <Pagination>
                                <PaginationContent>
                                    {currentPage > 1 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={createPageHref({
                                                    page: currentPage - 1,
                                                    category: selectedCategory,
                                                    keyword: searchKeyword,
                                                })}
                                                text=""
                                                className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                            />
                                        </PaginationItem>
                                    )}

                                    {pageNumbers.map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={createPageHref({
                                                    page: pageNumber,
                                                    category: selectedCategory,
                                                    keyword: searchKeyword,
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
                                                href={createPageHref({
                                                    page: currentPage + 1,
                                                    category: selectedCategory,
                                                    keyword: searchKeyword,
                                                })}
                                                text=""
                                                className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                            />
                                        </PaginationItem>
                                    )}
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


