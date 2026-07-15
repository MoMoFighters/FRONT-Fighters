"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import StudyRank from "@/components/study/StudyRank";
import StudyUserItem from "@/components/study/StudyUserItem";
import StudyTimer from "@/features/study/components/StudyTimer";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    leaveGroupStudy,
    pauseGroupStudyTimer,
    startGroupStudyTimer,
    stopGroupStudyTimer,
} from "@/features/study/actions";
import { buildRoomSeats, formatStudyTime } from "@/features/study/utils";
import type {
    GroupStudyDetail,
    StudyRankingEntry,
    StudyRoomSeatUser,
} from "@/features/study/type";

interface GroupStudyRoomViewProps {
    roomId: number;
    initialDetail: GroupStudyDetail;
    myNickname: string | null;
    dailyRanking: StudyRankingEntry[];
    monthlyRanking: StudyRankingEntry[];
}

export default function GroupStudyRoomView({
    roomId,
    initialDetail,
    myNickname,
    dailyRanking,
    monthlyRanking,
}: GroupStudyRoomViewProps) {
    const router = useRouter();
    const [detail, setDetail] = useState(initialDetail);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    const viewerIsHost = myNickname !== null && myNickname === detail.hostNickname;
    const seats = useMemo(
        () => buildRoomSeats(detail, myNickname),
        [detail, myNickname]
    );

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

    const handleTogglePause = async () => {
        if (isRunning) {
            const response = await pauseGroupStudyTimer(roomId);

            if (response.statusCode >= 400) {
                toast.error(response.message || "타이머 일시정지에 실패했습니다.");
                return;
            }

            setSeconds(response.data.accumulatedSeconds);
            setIsRunning(false);
            return;
        }

        const response = await startGroupStudyTimer(roomId);

        if (response.statusCode >= 400) {
            toast.error(response.message || "타이머 시작에 실패했습니다.");
            return;
        }

        setSeconds(response.data.accumulatedSeconds);
        setIsRunning(true);
    };

    const handleEnd = async () => {
        const response = await stopGroupStudyTimer(roomId);

        if (response.statusCode >= 400) {
            toast.error(response.message || "타이머 종료에 실패했습니다.");
            return;
        }

        setSeconds(response.data.totalSeconds);
        setIsRunning(false);
        setIsEnded(true);
    };

    const handleLeaveRoom = async () => {
        const response = await leaveGroupStudy(roomId);

        if (response.statusCode >= 400) {
            toast.error(response.message || "그룹방 나가기에 실패했습니다.");
            return;
        }

        toast(response.message || "스터디룸에서 나갔습니다.");
        router.push("/student/group-study");
        router.refresh();
    };

    const handleKickMember = (kickedUser: StudyRoomSeatUser) => {
        setDetail((prev) => ({
            ...prev,
            members: prev.members.filter((member) => member.userId !== kickedUser.userId),
        }));
    };

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-8">
            <div className="mx-auto w-full max-w-360">
                <StudentPageHeader
                    backHref="/student/group-study"
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "열품타",
                            href: "/student/group-study",
                        },
                        {
                            label: "스터디룸",
                        },
                    ]}
                    title="스터디룸"
                />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-360 items-start justify-center gap-8">
                <StudyRank
                    dailyRanking={dailyRanking}
                    monthlyRanking={monthlyRanking}
                />

                <section className="flex w-full max-w-125 flex-col">
                    <div className="relative rounded-2xl border border-slate-300 bg-white py-4 text-center shadow-sm">
                        <h1 className="text-2xl font-black text-slate-900">
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
                            className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            나가기
                        </button>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-12">
                        {seats.map((seat, index) => (
                            <StudyUserItem
                                key={seat?.userId ?? `empty-${index}`}
                                roomId={roomId}
                                user={seat}
                                canKick={viewerIsHost}
                                onKick={handleKickMember}
                            />
                        ))}
                    </div>
                </section>

                <StudyTimer
                    title={"집중\n타이머"}
                    seconds={seconds}
                    isRunning={isRunning}
                    isEnded={isEnded}
                    onTogglePause={() => void handleTogglePause()}
                    onEnd={() => void handleEnd()}
                />
            </div>
        </main>
    );
}
