'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PostLikedUser {
    userId: number;
    nickname: string;
    role: "STUDENT" | "TEACHER";
    profileImageUrl: string | null;
}

const likedUserDummyData: PostLikedUser[] = [
    {
        userId: 1,
        nickname: "모모학생",
        role: "STUDENT",
        profileImageUrl: null,
    },
    {
        userId: 2,
        nickname: "피치러버",
        role: "STUDENT",
        profileImageUrl: null,
    },
    {
        userId: 3,
        nickname: "요가쌤",
        role: "TEACHER",
        profileImageUrl: null,
    },
];

export default function PostLikeBtn({ postId, postLikeCount }: { postId: number; postLikeCount: number; }) {

    const [isModal, setIsModal] = useState(false);
    const [likedUsers] = useState<PostLikedUser[]>(likedUserDummyData);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <>
            <div
                className={`flex shrink-0 items-center gap-3 rounded-md ${isLiked ? "bg-rose-50" : "bg-slate-100"} px-3 py-2 text-sm font-black`}
            >
                {isLiked ? (
                    <Heart
                        className="h-4 w-4 cursor-pointer fill-current text-rose-500"
                        onClick={() => {
                            toast("좋아요 취소 성공");
                            setIsLiked(false)
                        }}
                    />
                ) : (
                    <Heart
                        className="h-4 w-4 cursor-pointer text-slate-500"
                        onClick={() => {
                            toast("좋아요 누르기 성공");
                            setIsLiked(true)
                        }}
                    />
                )}


                <button
                    type="button"
                    className={`cursor-pointer ${isLiked ? "text-rose-500" : "text-slate-600"}`}
                    onClick={() => setIsModal(true)}
                >
                    {postLikeCount}
                </button>
            </div>

            <Dialog
                open={isModal}
                onOpenChange={setIsModal}
            >
                <DialogContent className="overflow-hidden rounded-3xl border border-rose-100 bg-white p-0 shadow-2xl w-md">
                    <DialogHeader className="border-b border-slate-100 px-6 pb-4 pt-6">
                        <DialogTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
                            <span className="flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                                <Heart className="h-4 w-4 fill-current" />
                            </span>
                            좋아요
                        </DialogTitle>

                        <DialogDescription className="text-sm font-semibold text-slate-400">
                            이 게시글을 좋아한 사람 목록입니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[360px] overflow-y-auto px-3 py-3 scrollbar-hidden">
                        {likedUsers.length === 0 ? (
                            <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                                아직 좋아요를 누른 사람이 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {likedUsers.map((user) => (
                                    <div
                                        key={user.userId}
                                        className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-rose-50/70"
                                    >
                                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-100 to-indigo-100 text-sm font-black text-rose-500">
                                            {user.profileImageUrl ? (
                                                <img
                                                    src={user.profileImageUrl}
                                                    alt={`${user.nickname} 프로필`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                user.nickname.slice(0, 1)
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-black text-slate-800">
                                                {user.nickname}
                                            </p>
                                            <p className="mt-0.5 text-xs font-bold text-slate-400">
                                                {user.role === "TEACHER" ? "강사" : "수강생"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
