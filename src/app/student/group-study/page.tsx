import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

import GroupStudyActionsPanel from "@/components/study/GroupStudyActionsPanel";
import {
    getDailyStudyTime,
    getMonthlyStudyTime,
    getMyGroupStudyList,
    getMyStudyInviteList,
} from "@/features/study/actions";
import {
    formatStudyTime,
    getThisYearMonthString,
    getTodayDateString,
} from "@/features/study/utils";

export default async function GroupStudyMainPage() {
    const today = new Date();

    const [myRoomsResponse, myInvitesResponse, dailyResponse, monthlyResponse] = await Promise.all([
        getMyGroupStudyList(),
        getMyStudyInviteList(),
        getDailyStudyTime(getTodayDateString(today)),
        getMonthlyStudyTime(getThisYearMonthString(today)),
    ]);

    const myRooms = Array.isArray(myRoomsResponse.data) ? myRoomsResponse.data : [];
    const myInvites = Array.isArray(myInvitesResponse.data) ? myInvitesResponse.data : [];
    const dailySeconds = dailyResponse.data?.totalSeconds ?? 0;
    const monthlySeconds = monthlyResponse.data?.totalSeconds ?? 0;

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-12">
            <div className="mx-auto flex w-full max-w-240 flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        팀 스터디
                    </h1>
                    <p className="mt-2 text-sm font-bold text-slate-400">
                        친구들과 함께, 또는 혼자서 공부 시간을 기록해보세요.
                    </p>
                </div>

                {/* 나의 공부 통계 */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                            <Clock className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-black text-slate-400">
                                오늘 누적 공부시간
                            </p>
                            <p className="font-mono text-xl font-black text-slate-900">
                                {formatStudyTime(dailySeconds)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500">
                            <CalendarDays className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-xs font-black text-slate-400">
                                이번 달 누적 공부시간
                            </p>
                            <p className="font-mono text-xl font-black text-slate-900">
                                {formatStudyTime(monthlySeconds)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 방 만들기 + 받은 초대 목록 (상호작용 필요 - 클라이언트 컴포넌트) */}
                <GroupStudyActionsPanel initialInvites={myInvites} />

                {/* 내가 속한 그룹 */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-black text-slate-900">
                        내가 속한 그룹
                    </h2>

                    {myRooms.length === 0 ? (
                        <div className="mt-4 flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm font-bold text-slate-400">
                            참여 중인 스터디방이 없습니다.
                        </div>
                    ) : (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {myRooms.map((room) => (
                                <Link
                                    key={room.roomId}
                                    href={`/student/group-study/${room.roomId}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:bg-indigo-50/60"
                                >
                                    <p className="truncate text-sm font-black text-slate-900">
                                        {room.title}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                        방장 {room.hostNickname} · {room.memberCount}명 ·{" "}
                                        {room.status === "ACTIVE" ? "진행 중" : "종료됨"}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
