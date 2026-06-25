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
import type {
    CommunityCategory,
    CommunityPostListItem,
    CommunityPostSearchData,
} from "@/features/community/type";

interface CommunityPageProps {
    searchParams: Promise<{
        keyword?: string;
        category?: CommunityCategory | "ALL";
        page?: string;
    }>;
}

const PAGE_SIZE = 8;

const CATEGORY_OPTIONS: { value: CommunityCategory | "ALL"; label: string; }[] = [
    { value: "ALL", label: "전체" },
    { value: "STUDY", label: "학습" },
    { value: "FASHION", label: "패션" },
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
    pageNumber,
    category,
    keyword,
}: {
    pageNumber: number;
    category: CommunityCategory | "ALL";
    keyword: string;
}) => {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    } else if (category !== "ALL") {
        params.set("category", category);
    }

    params.set("page", String(pageNumber));

    return `/student/phone/community?${params.toString()}`;
};

const getSearchPage = async ({
    keyword,
    page,
}: {
    keyword: string;
    page: number;
}) => {
    let cursor: number | null = null;
    let result: CommunityPostSearchData = {
        totalCount: 0,
        posts: [],
        nextCursor: null,
    };

    for (let index = 0; index <= page; index += 1) {
        const response =
            await searchCommunityPostAction({
                keyword,
                cursor,
                size: PAGE_SIZE,
            });

        result = response.data ?? result;

        if (index < page) {
            if (result.nextCursor === null || result.nextCursor === undefined) {
                result = {
                    ...result,
                    posts: [],
                };
                break;
            }

            cursor = result.nextCursor;
        }
    }

    return result;
};

export default async function CommunityPage({
    searchParams,
}: CommunityPageProps) {
    const {
        keyword = "",
        category = "ALL",
        page,
    } = await searchParams;

    const normalizedKeyword = keyword.trim();
    const isSearchMode = normalizedKeyword.length > 0;
    const selectedCategory =
        isCommunityCategory(category)
            ? category
            : "ALL";
    const requestedPage =
        Math.max(Number(page) || 0, 0);

    let posts: CommunityPostListItem[] = [];
    let totalElements = 0;
    let totalPages = 1;
    let currentPage = requestedPage;

    if (isSearchMode) {
        const searchData =
            await getSearchPage({
                keyword: normalizedKeyword,
                page: requestedPage,
            });

        posts = searchData.posts;
        totalElements = searchData.totalCount;
        totalPages = Math.max(Math.ceil(searchData.totalCount / PAGE_SIZE), 1);
        currentPage = Math.min(requestedPage, totalPages - 1);
    } else {
        const response =
            await getCommunityPostListAction({
                category: selectedCategory === "ALL" ? undefined : selectedCategory,
                page: requestedPage,
                size: PAGE_SIZE,
            });

        const pageData = response.data ?? {
            posts: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: requestedPage,
        };

        posts = pageData.posts;
        totalElements = pageData.totalElements;
        totalPages = Math.max(pageData.totalPages, 1);
        currentPage = Math.min(pageData.currentPage, totalPages - 1);
    }

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
                                {isSearchMode
                                    ? `"${normalizedKeyword}" 검색 결과입니다.`
                                    : "모모시티 친구들과 이야기를 나눠보세요."}
                            </p>
                        </div>

                        <p className="text-xs font-bold text-slate-400">
                            게시글 {totalElements}개
                        </p>
                    </div>

                    <form
                        action="/student/phone/community"
                        className="mt-3 flex items-center gap-2"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                name="keyword"
                                defaultValue={normalizedKeyword}
                                placeholder="게시글 검색"
                                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
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
                            검색
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
                                    viewCount={post.viewCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                            <Search className="h-9 w-9 text-slate-300" />
                            <p className="mt-3 text-sm font-black text-slate-600">
                                {isSearchMode
                                    ? "검색 결과가 없습니다."
                                    : "게시글이 없습니다."}
                            </p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mr-[63px] mt-5">
                            <Pagination>
                                <PaginationContent>
                                    {currentPage > 0 && (
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={createPageHref({
                                                    pageNumber: currentPage - 1,
                                                    category: selectedCategory,
                                                    keyword: normalizedKeyword,
                                                })}
                                                text=""
                                                className="h-8 w-8 border border-slate-200 bg-white p-0 text-slate-500 hover:text-slate-900"
                                            />
                                        </PaginationItem>
                                    )}

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index
                                    ).map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={createPageHref({
                                                    pageNumber,
                                                    category: selectedCategory,
                                                    keyword: normalizedKeyword,
                                                })}
                                                isActive={currentPage === pageNumber}
                                                className={
                                                    currentPage === pageNumber
                                                        ? "h-8 w-8 border-indigo-300 bg-indigo-50 text-indigo-500 hover:bg-indigo-50"
                                                        : "h-8 w-8 text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                                                }
                                            >
                                                {pageNumber + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    {currentPage < totalPages - 1 && (
                                        <PaginationItem>
                                            <PaginationNext
                                                href={createPageHref({
                                                    pageNumber: currentPage + 1,
                                                    category: selectedCategory,
                                                    keyword: normalizedKeyword,
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
