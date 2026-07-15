import Link from "next/link";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Coins,
    CreditCard,
    Leaf,
    Settings,
    ShieldCheck,
    Store,
} from "lucide-react";

import { getLecturesWithAuth } from "@/app/services/lecture/service";
import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import PointStoreLink from "@/components/mypage/PointStoreLink";
import StudentLectureItem from "@/features/lecture/components/student/list/StudentLectureItem";
import { Lecture } from "@/features/lecture/type";
import { getPointHistoryListAction } from "@/features/point/action";
import {
    PointHistoryReason,
    PointHistoryTransactionType,
} from "@/features/point/type";
import { getMyInfo } from "@/features/user/action";
import MyPageProfileAvatar from "@/features/user/components/mypage/MyPageProfileAvatar";
import PasswordChangeMenuItem from "@/features/user/components/mypage/PasswordChangeMenuItem";
import TeacherRegistMenuItem from "@/features/auth/components/TeacherRegistMenuItem";

const POINT_REASON_LABEL: Record<PointHistoryReason, string> = {
    COMPLETE: "강의 완료 보상",
    REVIEW: "리뷰 작성 보상",
    PROFILE: "프로필 아이템",
    BUS: "버스 이용",
    GUESTBOOK: "방명록",
};

const POINT_TYPE_LABEL: Record<PointHistoryTransactionType, string> = {
    GAINED: "적립",
    USED: "사용",
};

const membershipBadgeStyle = {
    BASIC:
        'border border-zinc-300 bg-zinc-200/50 text-zinc-700',

    PLUS:
        'border border-zinc-400 text-zinc-800 bg-[linear-gradient(135deg,#ffffff_0%,#e5e7eb_25%,#9ca3af_50%,#e5e7eb_75%,#ffffff_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.7),0_1px_2px_rgba(0,0,0,.12)]',

    PRO:
        'border border-yellow-500 text-yellow-900 bg-[linear-gradient(135deg,#fff7cc_0%,#fcd34d_25%,#f59e0b_50%,#fcd34d_75%,#fff7cc_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.6),0_1px_2px_rgba(0,0,0,.12)]',
};

const formatDateTime = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return createdAt;
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};

export default async function StudentMyPage() {
    const [myInfoResponse, lectureResponse, pointHistoryResponse] =
        await Promise.all([
            getMyInfo(),
            getLecturesWithAuth({
                enrolled: true,
                page: 1,
            }),
            getPointHistoryListAction(1),
        ]);

    const userInfo = myInfoResponse.data;
    const userData = {
        name: userInfo?.name || "이름 없음",
        nickname: userInfo?.nickname || "닉네임 없음",
        email: userInfo?.email || "소셜 로그인 계정",
        profileImageUrl: userInfo?.profileImageUrl || "",
        createdAt: userInfo?.createdAt || new Date().toISOString(),
        points: userInfo?.points ?? 0,
        membership: userInfo?.membership
    };
    const lectures = (lectureResponse.content ?? []) as Lecture[];
    const pointHistory = pointHistoryResponse.data?.list ?? [];
    const totalPointHistory =
        pointHistoryResponse.data?.totalElements ?? pointHistory.length;



    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-8">
            <div className="mx-auto flex w-full max-w-360 gap-6">
                <aside className="sticky top-22 z-20 mb-auto w-68 shrink-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="rounded-t-3xl border-b border-slate-100 p-6">
                        <div className="flex items-center gap-4">
                            <MyPageProfileAvatar
                                profileImageUrl={userData.profileImageUrl}
                            />

                            <div className="min-w-0 w-full flex flex-row gap-2 items-center">
                                <p className="truncate text-lg font-black text-slate-900">
                                    {userData.nickname}
                                </p>
                                <p className={`px-2 py-1 rounded-lg text-xs ${membershipBadgeStyle[userData.membership || 'BASIC']}`}>
                                    {userData.membership}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-indigo-50 px-4 py-2 flex flex-row gap-2 items-center">
                            <p className="text-xs font-black text-indigo-500">
                                보유 포인트
                            </p>
                            <p className="text-xl font-black text-slate-900">
                                {userData.points.toLocaleString()}
                                <span className="ml-1 text-sm text-indigo-500">
                                    P
                                </span>
                            </p>
                        </div>
                    </div>

                    <nav className="p-3">
                        <ul className="space-y-1 text-sm font-bold text-slate-500">
                            <Link href="/student/mypage/edit">
                                <li className="cursor-pointer flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-900">
                                    <Settings className="h-4 w-4" />
                                    내 정보 수정
                                </li>
                            </Link>
                            <PasswordChangeMenuItem />
                            <Link href="/student/point-store">
                                <li className="cursor-pointer flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-900">
                                    <Store className="h-4 w-4" />
                                    포인트 상점
                                </li>
                            </Link>
                            <Link href="/student/mypage/membership">
                                <li className="cursor-pointer flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-slate-50 hover:text-slate-900">
                                    <ShieldCheck className="h-4 w-4" />
                                    멤버십 관리
                                </li>
                            </Link>
                            {myInfoResponse.data?.buildings === 0 ? (
                                <TeacherRegistMenuItem nickName={userData.nickname} />
                            ) : ""}

                        </ul>
                    </nav>
                </aside>

                <section className="min-w-0 flex-1 space-y-6">
                    <section className="grid grid-cols-2 gap-6">
                        <div className="relative z-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-900">
                                    모모민증
                                </h2>
                            </div>

                            <div className="overflow-hidden">
                                <MomoResidentCard data={userData} />
                            </div>
                        </div>

                        <div className="grid grid-rows-2 gap-4">
                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-emerald-500" />
                                    <h2 className="text-lg font-black text-slate-900">
                                        학습 잔디
                                    </h2>
                                </div>
                                <div className="mt-5 h-[110px] rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50" />
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-indigo-500" />
                                    <h2 className="text-lg font-black text-slate-900">
                                        활동 잔디
                                    </h2>
                                </div>
                                <div className="mt-5 h-[110px] rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50" />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-indigo-500" />
                                    <h2 className="text-lg font-black text-slate-900">
                                        내 강의 목록
                                    </h2>
                                </div>
                                <p className="mt-1 text-xs font-bold text-slate-400">
                                    수강 중인 강의를 한 화면에서 확인합니다.
                                </p>
                            </div>

                            <Link
                                href="/student/mypage/lectures"
                                className="flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                            >
                                전체보기
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <div className="scrollbar-none h-110 overflow-y-auto">
                            {lectures.length > 0 ? (
                                lectures.map((lecture) => (
                                    <StudentLectureItem
                                        key={lecture.lectureId}
                                        lecture={lecture}
                                        href={`/student/mypage/lectures/${lecture.lectureId}`}
                                        showLearningStatus
                                    />
                                ))
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                                    <BookOpen className="h-10 w-10" />
                                    <p className="mt-3 text-sm font-black">
                                        아직 수강 중인 강의가 없습니다.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Coins className="h-5 w-5 text-indigo-500" />
                                    <h2 className="text-lg font-black text-slate-900">
                                        포인트 내역
                                    </h2>
                                </div>
                                <p className="mt-1 text-xs font-bold text-slate-400">
                                    총 {totalPointHistory.toLocaleString()}건의 포인트 내역
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <PointStoreLink />
                                <Link
                                    href="/student/mypage/point"
                                    className="flex items-center gap-1 text-xs font-black text-indigo-500 transition hover:text-indigo-600"
                                >
                                    전체보기
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        <div className="scrollbar-none max-h-90 overflow-y-auto divide-y divide-slate-100">
                            {pointHistory.length > 0 ? (
                                pointHistory.map((item, index) => {
                                    const isIncrease = item.type === "GAINED";

                                    return (
                                        <div
                                            key={`${item.createdAt}-${item.reason}-${index}`}
                                            className="grid grid-cols-[144px_minmax(0,1fr)_112px] items-center gap-3 px-5 py-2.5 transition-colors hover:bg-slate-50"
                                        >
                                            <p className="text-[11px] font-bold text-slate-400">
                                                {formatDateTime(item.createdAt)}
                                            </p>

                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div
                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isIncrease
                                                        ? "bg-indigo-50 text-indigo-500"
                                                        : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    {isIncrease ? (
                                                        <ArrowDownLeft className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-slate-900">
                                                        {POINT_REASON_LABEL[item.reason] ??
                                                            item.reason}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400">
                                                        {POINT_TYPE_LABEL[item.type] ??
                                                            item.type}
                                                    </p>
                                                </div>
                                            </div>

                                            <p
                                                className={`text-right text-sm font-black ${isIncrease
                                                    ? "text-indigo-500"
                                                    : "text-rose-500"
                                                    }`}
                                            >
                                                {isIncrease ? "+" : "-"}
                                                {Math.abs(item.amount).toLocaleString()} P
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                    포인트 사용 내역이 없습니다.
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            </div>
        </main>
    );
}
