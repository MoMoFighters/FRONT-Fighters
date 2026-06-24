import { Search } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import CommunitySideBar from "@/components/phone/community/CommunitySideBar";
import PostListItem from "@/components/phone/community/PostListItem";

type CommunityCategory =
    | "STUDY"
    | "FASHION"
    | "BEAUTY"
    | "FITNESS"
    | "COOK"
    | "FREE";

interface CommunityPost {
    id: number;
    title: string;
    category: CommunityCategory;
    authorNickname: string;
    thumbnailUrl: string;
    likeCount: number;
    viewCount: number;
}

interface CommunityPageProps {
    searchParams: Promise<{
        keyword?: string;
        category?: CommunityCategory | "ALL";
        page?: string;
    }>;
}

const CATEGORY_OPTIONS = [
    {
        value: "ALL",
        label: "전체",
    },
    {
        value: "STUDY",
        label: "학습",
    },
    {
        value: "FASHION",
        label: "패션",
    },
    {
        value: "BEAUTY",
        label: "뷰티",
    },
    {
        value: "FITNESS",
        label: "피트니스",
    },
    {
        value: "COOK",
        label: "요리",
    },
    {
        value: "FREE",
        label: "자유",
    },
] as const;

const COMMUNITY_POSTS: CommunityPost[] = [
    {
        id: 1,
        title: "오늘 요리 수업 후기",
        category: "COOK",
        authorNickname: "복숭아밥상",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=360&q=80",
        likeCount: 24,
        viewCount: 10,
    },
    {
        id: 2,
        title: "헬스 초보 루틴 질문",
        category: "FITNESS",
        authorNickname: "운동시작",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=360&q=80",
        likeCount: 18,
        viewCount: 10,
    },
    {
        id: 3,
        title: "집중 잘 되는 공부법",
        category: "STUDY",
        authorNickname: "스터디메이트",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=360&q=80",
        likeCount: 9,
        viewCount: 10,
    },
    {
        id: 4,
        title: "그림 연습 같이 할 사람",
        category: "STUDY",
        authorNickname: "매일드로잉",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=360&q=80",
        likeCount: 31,
        viewCount: 10,
    },
    {
        id: 5,
        title: "오늘의 작은 성공 공유",
        category: "FREE",
        authorNickname: "도시산책",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=360&q=80",
        likeCount: 42,
        viewCount: 10,
    },
    {
        id: 6,
        title: "옷장 정리하고 배운 것",
        category: "FASHION",
        authorNickname: "색조합기록",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=360&q=80",
        likeCount: 16,
        viewCount: 10,
    },
    {
        id: 7,
        title: "피부 관리 루틴 추천",
        category: "BEAUTY",
        authorNickname: "아침루틴",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=360&q=80",
        likeCount: 27,
        viewCount: 10,
    },
    {
        id: 8,
        title: "주말 강의 추천 받아요",
        category: "FREE",
        authorNickname: "주말러",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=360&q=80",
        likeCount: 12,
        viewCount: 10,
    },
    {
        id: 9,
        title: "샐러드 만들기 성공",
        category: "COOK",
        authorNickname: "요리보고",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=360&q=80",
        likeCount: 35,
        viewCount: 10,
    },
    {
        id: 10,
        title: "아침 스트레칭 기록",
        category: "FITNESS",
        authorNickname: "매일운동",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=360&q=80",
        likeCount: 21,
        viewCount: 10,
    },
];

const PAGE_SIZE = 9;

const isCommunityCategory = (
    category?: string
): category is CommunityCategory => {
    return CATEGORY_OPTIONS.some(
        (option) => option.value === category && option.value !== "ALL"
    );
};

const createPageHref = ({
    pageNumber,
    keyword,
    category,
}: {
    pageNumber: number;
    keyword?: string;
    category?: CommunityCategory | "ALL";
}) => {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    }

    if (category && category !== "ALL") {
        params.set("category", category);
    }

    params.set("page", String(pageNumber));

    return `/student/phone/community?${params.toString()}`;
};

export default async function CommunityPage({
    searchParams,
}: CommunityPageProps) {
    const {
        keyword = "",
        category = "ALL",
        page,
    } = await searchParams;

    const selectedCategory = isCommunityCategory(category)
        ? category
        : "ALL";
    const normalizedKeyword = keyword.trim().toLowerCase();

    const filteredPosts = COMMUNITY_POSTS.filter((post) => {
        const isMatchedCategory =
            selectedCategory === "ALL" || post.category === selectedCategory;
        const isMatchedKeyword =
            !normalizedKeyword ||
            post.title.toLowerCase().includes(normalizedKeyword);

        return isMatchedCategory && isMatchedKeyword;
    });

    const totalPages = Math.max(Math.ceil(filteredPosts.length / PAGE_SIZE), 1);
    const currentPage = Math.min(
        Math.max(Number(page) || 1, 1),
        totalPages
    );
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const posts = filteredPosts.slice(startIndex, startIndex + PAGE_SIZE);

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
                                홈과 전체목록은 지금 같은 게시글 목록을 사용합니다.
                            </p>
                        </div>

                        <p className="text-xs font-bold text-slate-400">
                            게시글 {filteredPosts.length}개
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
                                defaultValue={keyword}
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
                                    key={post.id}
                                    id={post.id}
                                    thumbnailUrl={post.thumbnailUrl}
                                    title={post.title}
                                    category={post.category}
                                    likeCount={post.likeCount}
                                    authorNickname={post.authorNickname}
                                    viewCount={post.viewCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                            <Search className="h-9 w-9 text-slate-300" />
                            <p className="mt-3 text-sm font-black text-slate-600">
                                검색 결과가 없습니다.
                            </p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination className="-mt-2">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={createPageHref({
                                            pageNumber: currentPage - 1,
                                            keyword,
                                            category: selectedCategory,
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
                                        href={createPageHref({
                                            pageNumber,
                                            keyword,
                                            category: selectedCategory,
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
                                        href={createPageHref({
                                            pageNumber: currentPage + 1,
                                            keyword,
                                            category: selectedCategory,
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
