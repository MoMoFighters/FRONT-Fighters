import Link from "next/link";
import PostRecommentItem from "./PostRecommentItem";
import type { PostRecommandPanelProps } from "./PostDetailSide";

export default function PostRecommandPanel({
    currentPostId,
    posts,
}: PostRecommandPanelProps) {
    return (
        <>
            <div className="mb-3 flex shrink-0 items-center justify-between">
                <h2 className="text-base font-black text-slate-900">
                    추천 게시물
                </h2>
                <Link
                    href="/student/phone/community"
                    className="text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                >
                    목록 보기
                </Link>
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
                    />
                ))}
                {/* TODO: Extract recommended post item later. */}
                {/* ===================== RECOMMENDED_POST_COMPONENT_END ===================== */}
            </div>
        </>
    );
}
