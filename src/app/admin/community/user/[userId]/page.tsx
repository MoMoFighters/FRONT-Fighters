import CommunityProfilePostsPage, {
    isCommunityProfileViewMode,
} from "@/components/phone/community/CommunityProfilePostsPage";
import type { CommunityMypagePostViewMode } from "@/components/phone/community/CommunityMypagePostItem";
import { loadUserCommunityProfilePosts } from "@/features/community/profile";

interface CommunityUserPageProps {
    params: Promise<{
        userId: string;
    }>;
    searchParams: Promise<{
        mode?: CommunityMypagePostViewMode;
        page?: string;
    }>;
}

export default async function CommunityUserHome({
    params,
    searchParams,
}: CommunityUserPageProps) {
    const { userId } = await params;
    const { mode, page } = await searchParams;
    const numericUserId = Number(userId);
    const selectedMode = isCommunityProfileViewMode(mode) ? mode : "grid";
    const profileData = await loadUserCommunityProfilePosts({
        userId: numericUserId,
        page,
    });

    return (
        <CommunityProfilePostsPage
            role="ADMIN"
            profile={profileData.profile}
            dashboard={profileData.dashboard}
            posts={profileData.posts}
            selectedMode={selectedMode}
            currentPage={profileData.currentPage}
            totalPages={profileData.totalPages}
            totalCount={profileData.totalCount}
            pageBaseHref={`/admin/community/user/${numericUserId}`}
            detailHrefBase="/admin/community"
        />
    );
}
