"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import StudyUserItem from "@/components/study/StudyUserItem";
import StudyTimer from "@/features/study/components/StudyTimer";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    getGroupStudyDetail,
    getTimerAvailability,
    leaveGroupStudy,
    pauseGroupStudyTimer,
    startGroupStudyTimer,
    stopGroupStudyTimer,
} from "@/features/study/actions";
import { buildInitialMemberTimers, buildRoomSeats, formatStudyTime } from "@/features/study/utils";
import { useStudyCountUp } from "@/features/study/hooks/useStudyCountUp";
import type {
    GroupStudyDetail,
    SentStudyInvitationItem,
    StudyMemberTimerMeta,
    StudyRoomMemberKickedData,
    StudyRoomSeatUser,
    StudyRoomSocketEvent,
    StudyRoomTimerStatusChangedData,
} from "@/features/study/type";
import { getStudyRoomSubscribeDestination } from "@/app/services/study/service";
import { connectNoticeStomp } from "@/lib/stomp/stomp";

const IDLE_TIMER_META: StudyMemberTimerMeta = {
    timerStatus: null,
    startedAt: null,
    accumulatedSeconds: 0,
};

type RoomSeatSlot =
    | { kind: "member"; seat: StudyRoomSeatUser }
    | { kind: "invite"; invite: SentStudyInvitationItem }
    | { kind: "empty" };

interface GroupStudyRoomViewProps {
    roomId: number;
    accessToken: string;
    initialDetail: GroupStudyDetail;
    myNickname: string | null;
    rankingPanel: ReactNode;
    initialSentInvites: SentStudyInvitationItem[];
}

export default function GroupStudyRoomView({
    roomId,
    accessToken,
    initialDetail,
    myNickname,
    rankingPanel,
    initialSentInvites,
}: GroupStudyRoomViewProps) {
    const router = useRouter();
    const [detail, setDetail] = useState(initialDetail);
    // 멤버별 카운트업 상태 (userId -> timerStatus/startedAt/accumulatedSeconds).
    // 방 입장/새로고침 시엔 방 상세 응답으로 시딩하고, 이후엔 TIMER_STATUS_CHANGED 이벤트로만 갱신한다.
    const [memberTimers, setMemberTimers] = useState<Record<number, StudyMemberTimerMeta>>(
        () => buildInitialMemberTimers(initialDetail)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canStartTimer, setCanStartTimer] = useState(true);
    const [pendingInvites, setPendingInvites] = useState(initialSentInvites);
    const myUserIdRef = useRef<number | null>(null);

    const viewerIsHost = myNickname !== null && myNickname === detail.hostNickname;
    const seats = useMemo(
        () => buildRoomSeats(detail, myNickname),
        [detail, myNickname]
    );

    const myMember = useMemo(
        () => detail.members.find((member) => member.nickname === myNickname) ?? null,
        [detail.members, myNickname]
    );
    const myTimerMeta = (myMember && memberTimers[myMember.userId]) ?? IDLE_TIMER_META;
    const seconds = useStudyCountUp(myTimerMeta);
    const isRunning = myTimerMeta.timerStatus === "STUDYING";

    const invitedUserIds = useMemo(
        () => pendingInvites.map((invite) => invite.inviteeId),
        [pendingInvites]
    );

    const seatSlots = useMemo<RoomSeatSlot[]>(() => {
        const assignSlot = (index: number, inviteCursor: number): RoomSeatSlot[] => {
            if (index >= seats.length) {
                return [];
            }

            const seat = seats[index];

            if (seat) {
                return [{ kind: "member", seat }, ...assignSlot(index + 1, inviteCursor)];
            }

            if (inviteCursor < pendingInvites.length) {
                return [
                    { kind: "invite", invite: pendingInvites[inviteCursor] },
                    ...assignSlot(index + 1, inviteCursor + 1),
                ];
            }

            return [{ kind: "empty" }, ...assignSlot(index + 1, inviteCursor)];
        };

        return assignSlot(0, 0);
    }, [seats, pendingInvites]);

    useEffect(() => {
        myUserIdRef.current = myMember?.userId ?? null;
    }, [myMember]);

    const refreshTimerAvailability = useCallback(async () => {
        const response = await getTimerAvailability();

        if (response.status === 200 && response.data) {
            setCanStartTimer(response.data.canStartTimer);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshTimerAvailability();
    }, [refreshTimerAvailability]);

    // 좌석 그리드에 내려주는 콜백들은 useCallback으로 묶어야 StudyUserItem(memo)이
    // 타이머 tick(초당 리렌더)마다 새 함수 아이덴티티 때문에 같이 리렌더되는 걸 막을 수 있다.
    const handleInviteSent = useCallback((invite: {
        invitationId: number;
        inviteeId: number;
        inviteeNickname: string;
        inviteeProfileImageUrl?: string | null;
    }) => {
        setPendingInvites((prev) => [
            ...prev,
            {
                invitationId: invite.invitationId,
                roomId,
                title: detail.title,
                inviteeId: invite.inviteeId,
                inviteeNickname: invite.inviteeNickname,
                inviteeProfileImageUrl: invite.inviteeProfileImageUrl ?? null,
                invitedAt: new Date().toISOString(),
            },
        ]);
    }, [roomId, detail.title]);

    const handleInviteCanceled = useCallback((invitationId: number) => {
        setPendingInvites((prev) => prev.filter((invite) => invite.invitationId !== invitationId));
    }, []);

    // 실시간 이벤트의 data는 대부분 id값만 담고 있어(닉네임 등 상세정보 없음),
    // 멤버 입장/퇴장/방장위임/타이머 상태 변화는 방 상세를 다시 조회해서 갱신한다.
    // 내 타이머(isRunning/seconds)는 그대로 버튼 조작 응답으로만 갱신한다.
    const refetchDetail = useCallback(async () => {
        const response = await getGroupStudyDetail(roomId);

        if (response.status !== 200 || !response.data) {
            return;
        }

        const freshDetail = response.data;
        setDetail(freshDetail);

        // 이미 알고 있는 멤버는 기존 타이머 상태(STOMP로 받은 최신값)를 유지하고,
        // 새로 등장한 멤버만 방 상세 응답으로 시딩한다. 그렇지 않으면 멤버 입장/퇴장 이벤트가 올 때마다
        // 이미 진행 중이던 다른 멤버의 카운트업 기준시각이 "지금"으로 리셋되어 화면이 튄다.
        setMemberTimers((prev) => {
            const seeded = buildInitialMemberTimers(freshDetail);
            const merged: Record<number, StudyMemberTimerMeta> = { ...seeded };

            for (const member of freshDetail.members) {
                const existing = prev[member.userId];

                if (existing) {
                    merged[member.userId] = existing;
                }
            }

            return merged;
        });
    }, [roomId]);

    // TIMER_STATUS_CHANGED는 payload에 timerStatus/startedAt/accumulatedSeconds가 모두 들어있어서
    // 방 상세를 다시 조회하지 않고 바로 해당 멤버 상태만 갱신한다.
    const applyTimerStatusChanged = useCallback((data: StudyRoomTimerStatusChangedData) => {
        setDetail((prev) => ({
            ...prev,
            members: prev.members.map((member) =>
                member.userId === data.userId
                    ? { ...member, timerStatus: data.timerStatus }
                    : member
            ),
        }));

        setMemberTimers((prev) => ({
            ...prev,
            [data.userId]: {
                timerStatus: data.timerStatus,
                startedAt: data.startedAt,
                accumulatedSeconds: data.accumulatedSeconds,
            },
        }));
    }, []);

    const handleRoomEvent = useCallback((event: StudyRoomSocketEvent) => {
        switch (event.type) {
            case "MEMBER_JOINED":
            case "MEMBER_LEFT":
            case "HOST_CHANGED": {
                void refetchDetail();
                break;
            }

            case "TIMER_STATUS_CHANGED": {
                applyTimerStatusChanged(event.data as StudyRoomTimerStatusChangedData);
                break;
            }

            case "MEMBER_KICKED": {
                const { targetUserId } = event.data as StudyRoomMemberKickedData;
                const wasMe = myUserIdRef.current === targetUserId;

                if (wasMe) {
                    toast.error("방장에 의해 스터디룸에서 강퇴되었습니다.");
                    router.push("/student/group-study");
                    router.refresh();
                    return;
                }

                void refetchDetail();
                break;
            }

            case "ROOM_ENDED": {
                toast.info("스터디룸이 종료되었습니다.");
                router.push("/student/group-study");
                router.refresh();
                break;
            }
        }
    }, [refetchDetail, applyTimerStatusChanged, router]);

    useEffect(() => {
        let subscription:
            | ReturnType<ReturnType<typeof connectNoticeStomp>["subscribe"]>
            | undefined;

        const client = connectNoticeStomp({
            accessToken,
            onConnect: (stompClient) => {
                subscription = stompClient.subscribe(
                    getStudyRoomSubscribeDestination(roomId),
                    (body) => {
                        const event = JSON.parse(body) as StudyRoomSocketEvent;
                        handleRoomEvent(event);
                    }
                );
            },
        });

        return () => {
            subscription?.unsubscribe();
            client.disconnect();
        };
    }, [roomId, accessToken, handleRoomEvent]);

    const handleTogglePause = useCallback(async () => {
        if (isSubmitting) {
            return;
        }

        const myUserId = myMember?.userId;

        setIsSubmitting(true);

        try {
            if (isRunning) {
                const response = await pauseGroupStudyTimer(roomId);

                if (response.status >= 400) {
                    toast.error(response.message || "타이머 일시정지에 실패했습니다.");
                    return;
                }

                if (myUserId !== undefined) {
                    applyTimerStatusChanged({
                        userId: myUserId,
                        timerStatus: response.data.timerStatus === "STUDYING" ? "STUDYING" : "RESTING",
                        startedAt: null,
                        accumulatedSeconds: response.data.accumulatedSeconds,
                    });
                }

                void refreshTimerAvailability();
                return;
            }

            const response = await startGroupStudyTimer(roomId);

            if (response.status >= 400) {
                toast.error(response.message || "타이머 시작에 실패했습니다.");
                return;
            }

            if (myUserId !== undefined) {
                applyTimerStatusChanged({
                    userId: myUserId,
                    timerStatus: "STUDYING",
                    startedAt: response.data.startedAt,
                    accumulatedSeconds: response.data.accumulatedSeconds,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isRunning, isSubmitting, roomId, refreshTimerAvailability, myMember, applyTimerStatusChanged]);

    const handleEnd = useCallback(async () => {
        if (isSubmitting) {
            return;
        }

        const myUserId = myMember?.userId;

        setIsSubmitting(true);

        try {
            const response = await stopGroupStudyTimer(roomId);

            if (response.status >= 400) {
                toast.error(response.message || "타이머 종료에 실패했습니다.");
                return;
            }

            if (myUserId !== undefined) {
                applyTimerStatusChanged({
                    userId: myUserId,
                    timerStatus: "NONE",
                    startedAt: null,
                    accumulatedSeconds: response.data.totalSeconds,
                });
            }

            void refreshTimerAvailability();
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, roomId, refreshTimerAvailability, myMember, applyTimerStatusChanged]);

    const handleLeaveRoom = async () => {
        const response = await leaveGroupStudy(roomId);

        if (response.status >= 400) {
            toast.error(response.message || "그룹방 나가기에 실패했습니다.");
            return;
        }

        toast(response.message || "스터디룸에서 나갔습니다.");
        router.push("/student/group-study");
        router.refresh();
    };

    const handleKickMember = useCallback((kickedUser: StudyRoomSeatUser) => {
        setDetail((prev) => ({
            ...prev,
            members: prev.members.filter((member) => member.userId !== kickedUser.userId),
        }));
    }, []);

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-full max-w-360">
                <StudentPageHeader
                    backHref="/student/group-study"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "팀 스터디",
                            href: "/student/group-study",
                        },
                        {
                            label: "스터디룸",
                        },
                    ]}
                    title={detail.title}
                />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-360 flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-center">
                {rankingPanel}

                <section className="flex w-full flex-col lg:max-w-125">
                    <div className="relative rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <h1 className="text-xl font-black text-slate-900 sm:text-2xl">
                            내 공부시간{" "}
                            <span className="font-mono text-indigo-500">
                                {formatStudyTime(seconds)}
                            </span>
                        </h1>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                            방 번호 {roomId} · 최대 {detail.maxMember}명
                        </p>

                        <button
                            type="button"
                            onClick={() => void handleLeaveRoom()}
                            className="absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-black text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 sm:right-4 sm:px-2.5"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">나가기</span>
                        </button>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-2">
                        {seatSlots.map((slot, index) => {
                            if (slot.kind === "member") {
                                return (
                                    <StudyUserItem
                                        key={slot.seat.userId}
                                        roomId={roomId}
                                        user={slot.seat}
                                        timerMeta={memberTimers[slot.seat.userId] ?? {
                                            timerStatus: slot.seat.timerStatus,
                                            startedAt: null,
                                            accumulatedSeconds: slot.seat.totalSeconds,
                                        }}
                                        canKick={viewerIsHost}
                                        onKick={handleKickMember}
                                    />
                                );
                            }

                            if (slot.kind === "invite") {
                                return (
                                    <StudyUserItem
                                        key={`invite-${slot.invite.invitationId}`}
                                        roomId={roomId}
                                        pendingInvite={{
                                            invitationId: slot.invite.invitationId,
                                            inviteeId: slot.invite.inviteeId,
                                            inviteeNickname: slot.invite.inviteeNickname,
                                            inviteeProfileImageUrl: slot.invite.inviteeProfileImageUrl,
                                        }}
                                        invitedUserIds={invitedUserIds}
                                        onInviteCanceled={handleInviteCanceled}
                                    />
                                );
                            }

                            return (
                                <StudyUserItem
                                    key={`empty-${index}`}
                                    roomId={roomId}
                                    invitedUserIds={invitedUserIds}
                                    onInvited={handleInviteSent}
                                />
                            );
                        })}
                    </div>
                </section>

                <StudyTimer
                    title={"집중\n타이머"}
                    seconds={seconds}
                    isRunning={isRunning}
                    isSubmitting={isSubmitting}
                    canStart={canStartTimer}
                    onTogglePause={handleTogglePause}
                    onEnd={handleEnd}
                />
            </div>
        </main>
    );
}
