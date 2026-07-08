import CommunityRootPostsPage, {
    COMMUNITY_ROOT_PAGE_SIZE,
    isCommunityCategory,
    isCommunityRootViewMode,
} from "@/components/phone/community/CommunityRootPostsPage";
import {
    getCommunityPostListAction,
    searchCommunityPostAction,
} from "@/features/community/action";
import type { CommunityCategory } from "@/features/community/type";
import type { CommunityMypagePostViewMode } from "@/components/phone/community/CommunityMypagePostItem";

interface CommunityPageProps {
    searchParams: Promise<{
        category?: CommunityCategory | "ALL";
        cursor?: string;
        keyword?: string;
        mode?: CommunityMypagePostViewMode;
    }>;
}

export default async function CommunityPage({
    searchParams,
}: CommunityPageProps) {
    const {
        category = "ALL",
        cursor,
        keyword,
        mode,
    } = await searchParams;
    const selectedCategory =
        isCommunityCategory(category)
            ? category
            : "ALL";
    const selectedMode = isCommunityRootViewMode(mode) ? mode : "grid";
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
        size: COMMUNITY_ROOT_PAGE_SIZE,
    };
    const response = searchKeyword
        ? await searchCommunityPostAction({
            ...requestParams,
            keyword: searchKeyword,
        })
        : await getCommunityPostListAction(requestParams);
    const pageData = response.data ?? {
        posts: [],
        totalCount: 0,
        nextCursor: null,
    };
    const totalCount = pageData.totalCount ?? pageData.totalElements ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / COMMUNITY_ROOT_PAGE_SIZE));
    const currentPage =
        validCursor !== null
            ? Math.floor(validCursor / COMMUNITY_ROOT_PAGE_SIZE) + 1
            : 1;

    return (
        <CommunityRootPostsPage
            role="STUDENT"
            baseHref="/student/community"
            detailHrefBase="/student/community"
            posts={pageData.posts ?? []}
            selectedCategory={selectedCategory}
            selectedMode={selectedMode}
            searchKeyword={searchKeyword}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
        />
    );
}
