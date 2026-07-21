"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getStudentFriendListAction } from "@/features/friend/action";
import type { StudentFriendData } from "@/features/friend/type";
import { inviteStudyFriend } from "@/features/study/actions";
import StudyUserInviteItem from "./StudyUserInviteItem";

interface StudyUserInviteModalProps {
    roomId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    alreadyInvitedUserIds?: number[];
    onInvited?: (friend: StudentFriendData, invitationId: number) => void;
}

export default function StudyUserInviteModal({
    roomId,
    open,
    onOpenChange,
    alreadyInvitedUserIds = [],
    onInvited,
}: StudyUserInviteModalProps) {
    const [friends, setFriends] = useState<StudentFriendData[]>([]);
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        let ignore = false;

        const loadFriends = async () => {
            setIsLoading(true);

            try {
                const response = await getStudentFriendListAction();

                if (ignore) {
                    return;
                }

                setFriends(response.data ?? []);
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        void loadFriends();

        return () => {
            ignore = true;
        };
    }, [open]);

    const handleInvite = async (friend: StudentFriendData) => {
        const response = await inviteStudyFriend(roomId, { inviteeId: friend.userId });

        if (response.status >= 400) {
            toast.error(response.message || "초대 발송에 실패했습니다.");
            return;
        }

        setInvitedUserIds((prev) => [...prev, friend.userId]);
        toast.success(response.message || `${friend.nickname}님에게 초대를 보냈습니다.`);
        onInvited?.(friend, response.data.invitationId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>스터디 멤버 초대</DialogTitle>
                    <DialogDescription>
                        친구 목록에서 함께 공부할 멤버를 초대해보세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-80 space-y-2 overflow-y-auto scrollbar-none">
                    {isLoading ? (
                        <div className="py-10 text-center text-sm font-bold text-slate-400">
                            친구 목록을 불러오는 중입니다.
                        </div>
                    ) : friends.length > 0 ? (
                        friends.map((friend) => (
                            <StudyUserInviteItem
                                key={friend.userId}
                                friend={friend}
                                isInvited={
                                    invitedUserIds.includes(friend.userId) ||
                                    alreadyInvitedUserIds.includes(friend.userId)
                                }
                                onInvite={handleInvite}
                            />
                        ))
                    ) : (
                        <div className="py-10 text-center text-sm font-bold text-slate-400">
                            초대할 수 있는 친구가 없습니다.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
