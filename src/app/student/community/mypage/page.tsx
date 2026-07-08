import CommunityProfilePostsPage, {
    CommunityCreatePostLink,
    isCommunityProfileViewMode,
} from "@/components/phone/community/CommunityProfilePostsPage";
import { loadMyCommunityProfilePosts } from "@/features/community/profile";
import type { CommunityMypagePostViewMode } from "@/components/phone/community/CommunityMypagePostItem";

interface CommunityMyPageProps {
    searchParams: Promise<{
        mode?: CommunityMypagePostViewMode;
        page?: string;
    }>;
}

export default async function CommunityMyPage({
    searchParams,
}: CommunityMyPageProps) {
    const { mode, page } = await searchParams;
    const selectedMode = isCommunityProfileViewMode(mode) ? mode : "grid";
    const profileData = await loadMyCommunityProfilePosts({
        page,
        role: "STUDENT",
    });

    return (
        <CommunityProfilePostsPage
            profile={profileData.profile}
            dashboard={profileData.dashboard}
            posts={profileData.posts}
            selectedMode={selectedMode}
            currentPage={profileData.currentPage}
            totalPages={profileData.totalPages}
            totalCount={profileData.totalCount}
            pageBaseHref="/student/community/mypage"
            detailHrefBase="/student/community"
            actionSlot={<CommunityCreatePostLink href="/student/community/create" />}
        />
    );
}
