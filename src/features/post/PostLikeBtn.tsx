"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    getCommunityPostLikeListAction,
    likeCommunityPostAction,
    unlikeCommunityPostAction,
} from "@/features/community/action";
import type { CommunityPostLikedUser } from "@/features/community/type";
import PostLikedUserItem from "@/features/post/PostLikedUserItem";

interface PostLikeBtnProps {
    postId: number;
    postLikeCount: number;
    initialIsLiked?: boolean;
}

export default function PostLikeBtn({
    postId,
    postLikeCount,
    initialIsLiked = false,
}: PostLikeBtnProps) {
    const [isModal, setIsModal] = useState(false);
    const [likedUsers, setLikedUsers] = useState<CommunityPostLikedUser[]>([]);
    const [isLikeListLoaded, setIsLikeListLoaded] = useState(false);
    const [isLikeListLoading, setIsLikeListLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(postLikeCount);
    const [isPending, setIsPending] = useState(false);

    const loadLikedUsers = async () => {
        if (isLikeListLoading || isLikeListLoaded) {
            return;
        }

        setIsLikeListLoading(true);

        const response = await getCommunityPostLikeListAction(postId);

        if (response.status < 200 || response.status >= 300) {
            toast.error(response.message || "좋아요 목록 조회에 실패했습니다.");
            setIsLikeListLoading(false);
            return;
        }

        setLikedUsers(response.data?.users ?? []);
        setIsLikeListLoaded(true);
        setIsLikeListLoading(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsModal(open);

        if (open) {
            void loadLikedUsers();
        }
    };

    const handleToggleLike = async () => {
        if (isPending) {
            return;
        }

        const prevIsLiked = isLiked;
        const prevLikeCount = likeCount;
        const nextIsLiked = !prevIsLiked;
        const nextLikeCount = prevLikeCount + (nextIsLiked ? 1 : -1);

        setIsPending(true);
        setIsLiked(nextIsLiked);
        setLikeCount(nextLikeCount);

        const response =
            nextIsLiked
                ? await likeCommunityPostAction(postId)
                : await unlikeCommunityPostAction(postId);

        if (response.status < 200 || response.status >= 300) {
            setIsLiked(prevIsLiked);
            setLikeCount(prevLikeCount);
            toast.error(response.message || "좋아요 처리에 실패했습니다.");
            setIsPending(false);
            return;
        }

        setIsLikeListLoaded(false);
        toast.success(nextIsLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
        setIsPending(false);
    };

    return (
        <>
            <div
                className={`flex shrink-0 items-center gap-3 rounded-md ${isLiked ? "bg-rose-50" : "bg-slate-100"} px-3 py-2 text-sm font-black`}
            >
                <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current text-rose-500" : "text-slate-500"} ${isPending ? "cursor-wait opacity-60" : "cursor-pointer"}`}
                    onClick={handleToggleLike}
                />

                <button
                    type="button"
                    className={`cursor-pointer ${isLiked ? "text-rose-500" : "text-slate-600"}`}
                    onClick={() => handleOpenChange(true)}
                >
                    {likeCount}
                </button>
            </div>

            <Dialog
                open={isModal}
                onOpenChange={handleOpenChange}
            >
                <DialogContent className="w-md overflow-hidden rounded-3xl bg-white p-0 shadow-2xl">
                    <DialogHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
                        <DialogTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
                            <span className="flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                                <Heart className="h-4 w-4 fill-current" />
                            </span>
                            좋아요
                        </DialogTitle>

                        <DialogDescription className="text-sm font-bold text-slate-400">
                            이 게시글을 좋아한 사람 목록입니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[360px] overflow-y-auto px-3 pb-3 scrollbar-hidden">
                        {isLikeListLoading ? (
                            <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                                좋아요 목록을 불러오는 중입니다.
                            </div>
                        ) : likedUsers.length === 0 ? (
                            <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                                아직 좋아요를 누른 사람이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {likedUsers.map((user) => (
                                    <PostLikedUserItem
                                        key={user.userId}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
