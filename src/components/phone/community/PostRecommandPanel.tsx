import { getCommunityPostRecommendationsAction } from "@/features/community/action";
import type { CommunityAuthorRole } from "@/features/community/type";
import PostRecommentItem from "./PostRecommentItem";

interface PostRecommandPanelProps {
    postId: number;
    role: CommunityAuthorRole;
}

export default async function PostRecommandPanel({
    postId,
    role,
}: PostRecommandPanelProps) {
    const response = await getCommunityPostRecommendationsAction(postId);
    const posts = response.data
        ? [...response.data.topPosts, ...response.data.authorPosts]
        : [];

    return (
        <>
            <div className="mb-3 flex shrink-0 items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                    추천 게시물
                </h2>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {posts.map((item) => (
                    <PostRecommentItem
                        key={item.postId}
                        postId={item.postId}
                        thumbnailUrl={item.thumbnailUrl}
                        category={item.category}
                        createdAt={item.createdAt}
                        title={item.title}
                        authorName={item.authorName}
                        viewCount={item.viewCount}
                        likeCount={item.likeCount}
                        commentCount={item.commentCount ?? 0}
                        isActive={item.postId === postId}
                        role={role}
                    />
                ))}
            </div>
        </>
    );
}
