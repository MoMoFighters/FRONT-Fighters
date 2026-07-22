"use client";

import { useState } from "react";
import { BookOpen, Coffee, Crown, History, Plus, UserX, X } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    cancelStudyInvite,
    getGroupStudyLabList,
    kickGroupStudyMember,
} from "@/features/study/actions";
import type { StudyRoomSeatUser, StudyTimerLap } from "@/features/study/type";
import { formatLapSeconds } from "@/features/study/utils";
import StudyUserInviteModal from "./StudyUserInviteModal";

interface PendingInviteInfo {
    invitationId: number;
    inviteeId: number;
    inviteeNickname: string;
}

interface StudyUserItemProps {
    roomId: number;
    user?: StudyRoomSeatUser;
    canKick?: boolean;
    onKick?: (user: StudyRoomSeatUser) => void;
    showLapButton?: boolean;
    pendingInvite?: PendingInviteInfo | null;
    invitedUserIds?: number[];
    onInvited?: (invite: PendingInviteInfo) => void;
    onInviteCanceled?: (invitationId: number) => void;
}

export default function StudyUserItem({
    roomId,
    user,
    canKick = false,
    onKick,
    showLapButton = true,
    pendingInvite = null,
    invitedUserIds = [],
    onInvited,
    onInviteCanceled,
}: StudyUserItemProps) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLapModalOpen, setIsLapModalOpen] = useState(false);
    const [isLapLoading, setIsLapLoading] = useState(false);
    const [laps, setLaps] = useState<StudyTimerLap[]>([]);

    const handleCancelInvite = async () => {
        if (!pendingInvite) {
            return;
        }

        const response = await cancelStudyInvite(roomId, pendingInvite.invitationId);

        if (response.status >= 400) {
            toast.error(response.message || "초대 취소에 실패했습니다.");
            return;
        }

        toast(response.message || `${pendingInvite.inviteeNickname}님에게 보낸 초대를 취소했습니다.`);
        onInviteCanceled?.(pendingInvite.invitationId);
    };

    const handleKick = async () => {
        if (!user) {
            return;
        }

        const response = await kickGroupStudyMember(roomId, user.userId);

        if (response.status >= 400) {
            toast.error(response.message || "멤버 내보내기에 실패했습니다.");
            return;
        }

        toast(response.message || `${user.nickname}님을 내보냈습니다.`);
        onKick?.(user);
    };

    const handleOpenLapModal = async () => {
        if (!user) {
            return;
        }

        setIsLapModalOpen(true);
        setIsLapLoading(true);

        try {
            const response = await getGroupStudyLabList(roomId, user.userId);

            if (response.status >= 400) {
                toast.error(response.message || "랩 목록을 불러오지 못했습니다.");
                setLaps([]);
                return;
            }

            setLaps(response.data.laps);
        } finally {
            setIsLapLoading(false);
        }
    };

    if (!user) {
        if (pendingInvite) {
            return (
                <div className="relative pt-7">
                    <div className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 text-indigo-400 sm:h-28">
                        <span className="text-xs font-bold">
                            {pendingInvite.inviteeNickname}님에게 초대를 보냈어요
                        </span>
                        <button
                            type="button"
                            onClick={() => void handleCancelInvite()}
                            className="flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-black text-rose-500 shadow-sm transition hover:bg-rose-50"
                        >
                            <X className="h-3 w-3" />
                            초대 취소
                        </button>
                    </div>

                    <div className="mt-2 rounded-lg border border-transparent py-1.5 text-center text-sm font-bold text-transparent">
                        -
                    </div>
                </div>
            );
        }

        return (
            <div className="relative pt-7">
                <button
                    type="button"
                    onClick={() => setIsInviteOpen(true)}
                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-500 sm:h-28"
                >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-bold">초대하기</span>
                </button>

                <div className="mt-2 rounded-lg border border-transparent py-1.5 text-center text-sm font-bold text-transparent">
                    -
                </div>

                <StudyUserInviteModal
                    roomId={roomId}
                    open={isInviteOpen}
                    onOpenChange={setIsInviteOpen}
                    alreadyInvitedUserIds={invitedUserIds}
                    onInvited={(friend, invitationId) => {
                        onInvited?.({
                            invitationId,
                            inviteeId: friend.userId,
                            inviteeNickname: friend.nickname,
                        });
                        setIsInviteOpen(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="relative pt-7">
            {user.isHost && (
                <Crown
                    className="absolute left-1/2 top-0 z-10 h-6 w-6 -translate-x-1/2 text-amber-400"
                    fill="currentColor"
                />
            )}

            <div className="absolute left-1/2 top-1 z-3 flex h-12 w-12 -translate-x-1/2 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-sm font-black text-slate-400 shadow-sm sm:h-14 sm:w-14">
                {user.nickname.slice(0, 1)}
            </div>

            <div
                className={`relative flex h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-white px-2 shadow-sm sm:h-28 ${user.isMe ? "border-orange-400" : "border-slate-200"
                    }`}
            >
                {canKick && !user.isMe && (
                    <button
                        type="button"
                        onClick={() => void handleKick()}
                        aria-label="내보내기"
                        className="absolute -left-2 -top-2 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition hover:bg-rose-600"
                    >
                        <UserX className="h-3.5 w-3.5" />
                    </button>
                )}

                {showLapButton && (
                    <button
                        type="button"
                        onClick={() => void handleOpenLapModal()}
                        aria-label="랩 기록 보기"
                        className="absolute -right-2 -top-2 z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white shadow-sm transition hover:bg-slate-800"
                    >
                        <History className="h-3.5 w-3.5" />
                    </button>
                )}

                {user.timerStatus === "STUDYING" ? (
                    <>
                        <BookOpen className="h-6 w-6 text-indigo-400" />
                        <span className="text-[11px] font-bold text-indigo-500">공부 중</span>
                    </>
                ) : user.timerStatus === "RESTING" ? (
                    <>
                        <Coffee className="h-6 w-6 text-amber-400" />
                        <span className="text-[11px] font-bold text-amber-500">쉬는 중</span>
                    </>
                ) : (
                    <span className="text-[11px] font-bold text-slate-300">대기 중</span>
                )}
            </div>

            <div
                className={`mt-2 truncate rounded-lg border py-1.5 text-center text-sm font-bold ${user.isMe
                    ? "border-orange-200 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
            >
                {user.isMe ? `${user.nickname}(나)` : user.nickname}
            </div>

            <Dialog open={isLapModalOpen} onOpenChange={setIsLapModalOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{user.nickname}님의 랩 기록</DialogTitle>
                        <DialogDescription>
                            이번 스터디룸에서 기록한 랩 목록입니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="h-72 space-y-1 overflow-y-auto scrollbar-none">
                        {isLapLoading ? (
                            <div className="py-6 text-center text-xs font-bold text-slate-400">
                                불러오는 중...
                            </div>
                        ) : laps.length === 0 ? (
                            <div className="py-6 text-center text-xs font-bold text-slate-400">
                                기록된 랩이 없습니다.
                            </div>
                        ) : (
                            laps.map((lap) => (
                                <div
                                    key={lap.lapNumber}
                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                                >
                                    <span className="text-xs font-bold text-slate-500">
                                        Lap {lap.lapNumber}
                                    </span>
                                    <span className="font-mono text-sm font-black text-slate-800">
                                        {formatLapSeconds(lap.seconds)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
