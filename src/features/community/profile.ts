import { getMyInfo } from "@/features/user/action";
import {
    getMyCommunityDashboardAction,
    getMyCommunityPostListAction,
    getUserCommunityDashboardAction,
    getUserCommunityPostListAction,
} from "./action";
import type {
    CommunityAuthorRole,
    CommunityPostDashboardData,
    CommunityPostListData,
    CommunityPostListItem,
} from "./type";
import type { CommunityProfileData } from "@/components/phone/community/CommunityProfilePostsPage";

export const COMMUNITY_PROFILE_PAGE_SIZE = 8;

interface LoadedCommunityProfilePosts {
    profile: CommunityProfileData;
    dashboard: CommunityPostDashboardData;
    posts: CommunityPostListItem[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

const emptyDashboard: CommunityPostDashboardData = {
    totalPostCount: 0,
    totalViewCount: 0,
    totalLikeCount: 0,
    totalCommentCount: 0,
};

const emptyPostList: CommunityPostListData = {
    totalCount: 0,
    posts: [],
    nextCursor: null,
};

const normalizePage = (page?: string) =>
    Math.max(Number(page) || 1, 1);

const getProfileFromPosts = (
    posts: CommunityPostListItem[],
    fallbackUserId: number
): CommunityProfileData => {
    const firstPost = posts[0];

    if (!firstPost) {
        return {
            userId: fallbackUserId,
            nickname: `사용자 ${fallbackUserId}`,
            role: "STUDENT",
            profileImageUrl: null,
        };
    }

    return {
        userId: firstPost.authorId,
        nickname: firstPost.authorName,
        role: firstPost.authorRole,
        profileImageUrl: firstPost.authorProfileImageUrl,
    };
};

const loadCursorPage = async (
    page: number,
    fetchPage: (cursor?: number | null) => Promise<CommunityPostListData>
) => {
    let cursor: number | null | undefined;
    let data = emptyPostList;

    for (let index = 1; index <= page; index += 1) {
        data = await fetchPage(cursor);

        if (index === page || data.nextCursor === null) {
            break;
        }

        cursor = data.nextCursor;
    }

    return data;
};

export const loadMyCommunityProfilePosts = async ({
    page,
    role,
}: {
    page?: string;
    role: CommunityAuthorRole;
}): Promise<LoadedCommunityProfilePosts> => {
    const currentPage = normalizePage(page);
    const [myInfoResponse, dashboardResponse] = await Promise.all([
        getMyInfo(),
        getMyCommunityDashboardAction(),
    ]);
    const dashboard = dashboardResponse.data ?? emptyDashboard;
    const totalCount = dashboard.totalPostCount;
    const totalPages = Math.max(
        Math.ceil(totalCount / COMMUNITY_PROFILE_PAGE_SIZE),
        1
    );
    const safePage = Math.min(currentPage, totalPages);
    const postList = await loadCursorPage(safePage, async (cursor) => {
        const response = await getMyCommunityPostListAction({
            cursor,
            size: COMMUNITY_PROFILE_PAGE_SIZE,
        });

        return response.data ?? emptyPostList;
    });

    return {
        profile: {
            userId: 0,
            nickname: myInfoResponse.data?.nickname ?? "내 프로필",
            role,
            profileImageUrl: myInfoResponse.data?.profileImageUrl ?? null,
        },
        dashboard,
        posts: postList.posts,
        totalCount,
        totalPages,
        currentPage: safePage,
    };
};

export const loadUserCommunityProfilePosts = async ({
    userId,
    page,
}: {
    userId: number;
    page?: string;
}): Promise<LoadedCommunityProfilePosts> => {
    const currentPage = normalizePage(page);
    const dashboardResponse = await getUserCommunityDashboardAction(userId);
    const dashboard = dashboardResponse.data ?? emptyDashboard;
    const totalCount = dashboard.totalPostCount;
    const totalPages = Math.max(
        Math.ceil(totalCount / COMMUNITY_PROFILE_PAGE_SIZE),
        1
    );
    const safePage = Math.min(currentPage, totalPages);
    const postList = await loadCursorPage(safePage, async (cursor) => {
        const response = await getUserCommunityPostListAction({
            userId,
            cursor,
            size: COMMUNITY_PROFILE_PAGE_SIZE,
        });

        return response.data ?? emptyPostList;
    });

    return {
        profile: getProfileFromPosts(postList.posts, userId),
        dashboard,
        posts: postList.posts,
        totalCount,
        totalPages,
        currentPage: safePage,
    };
};
