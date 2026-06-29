import CommunityProfilePostsPage, {
    CommunityCreatePostLink,
    isCommunityProfileViewMode,
} from "@/components/phone/community/CommunityProfilePostsPage";
import type { CommunityMypagePostViewMode } from "@/components/phone/community/CommunityMypagePostItem";
import { loadMyCommunityProfilePosts } from "@/features/community/profile";

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
        role: "TEACHER",
    });

    return (
        <CommunityProfilePostsPage
            role="TEACHER"
            profile={profileData.profile}
            dashboard={profileData.dashboard}
            posts={profileData.posts}
            selectedMode={selectedMode}
            currentPage={profileData.currentPage}
            totalPages={profileData.totalPages}
            totalCount={profileData.totalCount}
            pageBaseHref="/teacher/community/mypage"
            detailHrefBase="/teacher/community"
            actionSlot={<CommunityCreatePostLink href="/teacher/community/create" />}
        />
    );
}
