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
import { buildRoomSeats, formatStudyTime } from "@/features/study/utils";
import type {
    GroupStudyDetail,
    SentStudyInvitationItem,
    StudyRoomMemberKickedData,
    StudyRoomSeatUser,
    StudyRoomSocketEvent,
} from "@/features/study/type";
import { getStudyRoomSubscribeDestination } from "@/app/services/study/service";
import { connectNoticeStomp } from "@/lib/stomp/stomp";

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
    const [seconds, setSeconds] = useState(
        () => initialDetail.members.find((member) => member.nickname === myNickname)?.totalSeconds ?? 0
    );
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [canStartTimer, setCanStartTimer] = useState(true);
    const [pendingInvites, setPendingInvites] = useState(initialSentInvites);
    const myUserIdRef = useRef<number | null>(null);

    const viewerIsHost = myNickname !== null && myNickname === detail.hostNickname;
    const seats = useMemo(
        () => buildRoomSeats(detail, myNickname),
        [detail, myNickname]
    );

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
        myUserIdRef.current =
            detail.members.find((member) => member.nickname === myNickname)?.userId ?? null;
    }, [detail.members, myNickname]);

    useEffect(() => {
        const me = detail.members.find((member) => member.nickname === myNickname);
        setIsRunning(me?.timerStatus === "STUDYING");
        // 최초 진입 시 내 타이머 상태만 반영 (그 이후는 버튼 조작으로만 갱신)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isRunning]);

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
    }) => {
        setPendingInvites((prev) => [
            ...prev,
            {
                invitationId: invite.invitationId,
                roomId,
                title: detail.title,
                inviteeId: invite.inviteeId,
                inviteeNickname: invite.inviteeNickname,
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

        if (response.status === 200 && response.data) {
            setDetail(response.data);
        }
    }, [roomId]);

    const handleRoomEvent = useCallback((event: StudyRoomSocketEvent) => {
        switch (event.type) {
            case "MEMBER_JOINED":
            case "MEMBER_LEFT":
            case "HOST_CHANGED":
            case "TIMER_STATUS_CHANGED": {
                void refetchDetail();
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
    }, [refetchDetail, router]);

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

        setIsSubmitting(true);

        try {
            if (isRunning) {
                const response = await pauseGroupStudyTimer(roomId);

                if (response.status >= 400) {
                    toast.error(response.message || "타이머 일시정지에 실패했습니다.");
                    return;
                }

                setSeconds(response.data.accumulatedSeconds);
                setIsRunning(false);
                void refreshTimerAvailability();
                return;
            }

            const response = await startGroupStudyTimer(roomId);

            if (response.status >= 400) {
                toast.error(response.message || "타이머 시작에 실패했습니다.");
                return;
            }

            setSeconds(response.data.accumulatedSeconds);
            setIsRunning(true);
        } finally {
            setIsSubmitting(false);
        }
    }, [isRunning, isSubmitting, roomId, refreshTimerAvailability]);

    const handleEnd = useCallback(async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await stopGroupStudyTimer(roomId);

            if (response.status >= 400) {
                toast.error(response.message || "타이머 종료에 실패했습니다.");
                return;
            }

            setSeconds(response.data.totalSeconds);
            setIsRunning(false);
            void refreshTimerAvailability();
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, roomId, refreshTimerAvailability]);

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
