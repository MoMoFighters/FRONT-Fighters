"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Plus, Users, X } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    acceptStudyInvite,
    createGroupStudy,
    denyStudyInvite,
} from "@/features/study/actions";
import type { MyStudyInvitationItem } from "@/features/study/type";

interface GroupStudyActionsPanelProps {
    initialInvites: MyStudyInvitationItem[];
}

export default function GroupStudyActionsPanel({
    initialInvites,
}: GroupStudyActionsPanelProps) {
    const router = useRouter();
    const [invites, setInvites] = useState(initialInvites);
    const [isCreating, setIsCreating] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [title, setTitle] = useState("");

    const handleCreateGroupRoom = async () => {
        const trimmedTitle = title.trim();

        if (isCreating || !trimmedTitle) {
            return;
        }

        setIsCreating(true);

        try {
            const response = await createGroupStudy({ title: trimmedTitle });

            if (response.statusCode >= 400) {
                toast.error(response.message || "그룹방 생성에 실패했습니다.");
                return;
            }

            toast.success(response.message || "그룹방을 생성했습니다.");
            setIsCreateModalOpen(false);
            router.push(`/student/group-study/${response.data.roomId}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleAcceptInvite = async (invite: MyStudyInvitationItem) => {
        const response = await acceptStudyInvite(invite.roomId);

        if (response.statusCode >= 400) {
            toast.error(response.message || "초대 수락에 실패했습니다.");
            return;
        }

        setInvites((prev) => prev.filter((item) => item.invitationId !== invite.invitationId));
        toast.success(response.message || "그룹방에 참여했습니다.");
        router.push(`/student/group-study/${invite.roomId}`);
    };

    const handleRejectInvite = async (invite: MyStudyInvitationItem) => {
        const response = await denyStudyInvite(invite.roomId);

        if (response.statusCode >= 400) {
            toast.error(response.message || "초대 거절에 실패했습니다.");
            return;
        }

        setInvites((prev) => prev.filter((item) => item.invitationId !== invite.invitationId));
        toast(response.message || "초대를 거절했습니다.");
    };

    return (
        <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-slate-900">
                    방 만들기
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <Link
                        href="/student/group-study/solo"
                        className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:bg-indigo-50/60"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                            <Plus className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-black text-slate-800">
                            솔로 세션 시작
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            혼자 집중해서 공부 시간을 기록합니다.
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/60"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                            <Users className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-black text-slate-800">
                            단체 세션 만들기
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                            방을 만들고 들어가서 친구를 초대합니다.
                        </span>
                    </button>
                </div>
            </section>

            <Dialog
                open={isCreateModalOpen}
                onOpenChange={(nextOpen) => {
                    if (isCreating) {
                        return;
                    }

                    setIsCreateModalOpen(nextOpen);

                    if (!nextOpen) {
                        setTitle("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>단체 세션 만들기</DialogTitle>
                        <DialogDescription>
                            방 제목을 입력하고 스터디룸을 만들어보세요.
                        </DialogDescription>
                    </DialogHeader>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="예) 스터디룸 #1"
                        maxLength={30}
                        autoFocus
                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />

                    <DialogFooter>
                        <button
                            type="button"
                            disabled={isCreating || !title.trim()}
                            onClick={() => void handleCreateGroupRoom()}
                            className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-indigo-500 px-4 text-sm font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                            {isCreating ? "생성 중..." : "만들기"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-slate-900">
                    받은 초대 목록
                </h2>

                {invites.length === 0 ? (
                    <div className="mt-4 flex h-20 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm font-bold text-slate-400">
                        받은 초대가 없습니다.
                    </div>
                ) : (
                    <div className="mt-4 space-y-2">
                        {invites.map((invite) => (
                            <div
                                key={invite.invitationId}
                                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-slate-900">
                                        {invite.title}
                                    </p>
                                    <p className="mt-0.5 text-xs font-bold text-slate-400">
                                        {invite.hostNickname}님이 초대했어요
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => void handleAcceptInvite(invite)}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-600"
                                        aria-label="수락"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleRejectInvite(invite)}
                                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
                                        aria-label="거절"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
