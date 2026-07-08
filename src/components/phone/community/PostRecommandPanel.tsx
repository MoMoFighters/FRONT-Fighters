import PostRecommentItem from "./PostRecommentItem";
import type { PostRecommandPanelProps } from "./PostDetailSide";

export default function PostRecommandPanel({
    currentPostId,
    posts,
    role
}: PostRecommandPanelProps) {
    return (
        <>
            <div className="mb-3 flex shrink-0 items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                    추천 게시물
                </h2>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* ==================== RECOMMENDED_POST_COMPONENT_START ==================== */}
                {/* TODO: Extract recommended post item later. */}
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
                        commentCount={item.commentCount}
                        isActive={item.postId === currentPostId}
                        role={role}
                    />
                ))}
                {/* TODO: Extract recommended post item later. */}
                {/* ===================== RECOMMENDED_POST_COMPONENT_END ===================== */}
            </div>
        </>
    );
}
