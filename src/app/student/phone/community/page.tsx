import Link from "next/link";
import { Heart, ImageIcon, Plus, Search } from "lucide-react";

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
import { Button } from "@/components/ui/button";

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
    content: string;
    thumbnailUrl: string;
    likeCount: number;
}

interface CommunityPageProps {
    searchParams: Promise<{
        keyword?: string;
        category?: CommunityCategory | "ALL";
        page?: string;
    }>;
}

const CATEGORY_LABEL: Record<CommunityCategory, string> = {
    STUDY: "학습",
    FASHION: "패션",
    BEAUTY: "뷰티",
    FITNESS: "피트니스",
    COOK: "요리",
    FREE: "자유",
};

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
        content:
            "김김김",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=360&q=80",
        likeCount: 24,
    },
    {
        id: 2,
        title: "헬스 초보 루틴 질문",
        category: "FITNESS",
        content:
            "주 3회 정도 운동할 수 있는데 상체, 하체를 어떻게 나눠야 할지 모르겠어요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=360&q=80",
        likeCount: 18,
    },
    {
        id: 3,
        title: "집중 잘 되는 공부법",
        category: "STUDY",
        content:
            "짧게 타이머를 맞추고 쉬는 시간을 정해두니까 훨씬 집중이 잘 됐어요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=360&q=80",
        likeCount: 9,
    },
    {
        id: 4,
        title: "그림 연습 같이 할 사람",
        category: "STUDY",
        content:
            "매일 30분씩 크로키 인증하는 작은 스터디를 만들고 싶어요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=360&q=80",
        likeCount: 31,
    },
    {
        id: 5,
        title: "오늘의 작은 성공 공유",
        category: "FREE",
        content:
            "계속 미루던 강의 하나를 드디어 끝냈습니다. 끝내니까 기분이 꽤 좋네요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=360&q=80",
        likeCount: 42,
    },
    {
        id: 6,
        title: "옷장 정리하고 느낀 점",
        category: "FASHION",
        content:
            "색 조합 기준을 배우고 나니까 안 입는 옷이 왜 안 입히는지 바로 보였어요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=360&q=80",
        likeCount: 16,
    },
    {
        id: 7,
        title: "피부 관리 루틴 추천",
        category: "BEAUTY",
        content:
            "아침저녁으로 부담 없이 할 수 있는 기본 루틴이 궁금해요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=360&q=80",
        likeCount: 27,
    },
    {
        id: 8,
        title: "주말 강의 추천 받아요",
        category: "FREE",
        content:
            "주말에 가볍게 듣기 좋은 강의 있으면 추천해주세요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=360&q=80",
        likeCount: 12,
    },
    {
        id: 9,
        title: "샐러드 만들기 성공",
        category: "COOK",
        content:
            "요리 강의 보고 처음으로 직접 만들어봤는데 생각보다 괜찮았어요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=360&q=80",
        likeCount: 35,
    },
    {
        id: 10,
        title: "아침 스트레칭 기록",
        category: "FITNESS",
        content:
            "짧게라도 매일 하니까 몸이 조금씩 가벼워지는 느낌이에요.",
        thumbnailUrl:
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=360&q=80",
        likeCount: 21,
    },
];

const PAGE_SIZE = 9;
const MAX_CONTENT_LENGTH = 34;

const truncateContent = (content: string) => {
    if (content.length <= MAX_CONTENT_LENGTH) {
        return content;
    }

    return `${content.slice(0, MAX_CONTENT_LENGTH)}...`;
};

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
            post.title.toLowerCase().includes(normalizedKeyword) ||
            post.content.toLowerCase().includes(normalizedKeyword);

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
        <section className="flex h-full min-h-0 flex-col rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
            <header className="shrink-0">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                            커뮤니티
                        </h1>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <Link
                            href='/student/phone/community/create'
                            className="cursor-pointer flex flex-row gap-1 items-center rounded-lg"
                        >
                            <Plus className="h-4" />
                            <p className="text-[16px]">게시글 등록</p>
                        </Link>
                        <p className="text-xs font-bold text-slate-400 text-right">
                            게시글 {filteredPosts.length}개
                        </p>
                    </div>
                </div>

                <form
                    action="/student/phone/community"
                    className="mt-4 flex items-center gap-2"
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
                        className="h-9 rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-indigo-500"
                    >
                        검색
                    </button>
                </form>
            </header>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-4 gap-8">
                        {/* ==================== COMMUNITY_POST_ITEM_COMPONENT_START ==================== */}
                        {/* TODO: 아래 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/student/phone/community/${post.id}`}
                                className="group overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    {post.thumbnailUrl ? (
                                        <img
                                            src={post.thumbnailUrl}
                                            alt={`${post.title} 썸네일`}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                    )}

                                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-indigo-500 shadow-sm">
                                        {CATEGORY_LABEL[post.category]}
                                    </span>
                                </div>

                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="line-clamp-1 text-sm font-black text-slate-900">
                                            {post.title}
                                        </h2>

                                        <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[11px] font-bold text-rose-400">
                                            <Heart className="h-3 w-3 fill-current" />
                                            {post.likeCount}
                                        </span>
                                    </div>

                                    <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500">
                                        {truncateContent(post.content)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {/* TODO: 위 게시글 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                        {/* ===================== COMMUNITY_POST_ITEM_COMPONENT_END ===================== */}
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
                <Pagination className="">
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
    );
}
