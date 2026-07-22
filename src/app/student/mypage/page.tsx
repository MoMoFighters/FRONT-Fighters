import Link from "next/link";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Coins,
    CreditCard,
    Leaf,
    Receipt,
    ShieldCheck,
    Store,
} from "lucide-react";

import { getLecturesWithAuth } from "@/app/services/lecture/service";
import MomoResidentCard from "@/components/mypage/MomoResidentCard";
import PointStoreLink from "@/components/mypage/PointStoreLink";
import StudentLectureItem from "@/features/lecture/components/student/list/StudentLectureItem";
import { Lecture } from "@/features/lecture/type";
import { getPointHistoryListAction } from "@/features/point/action";
import PointGuideButton from "@/features/point/components/PointGuideButton";
import {
    PointHistoryReason,
    PointHistoryTransactionType,
} from "@/features/point/type";
import { getMyInfo } from "@/features/user/action";
import MyPageProfileAvatar from "@/features/user/components/mypage/MyPageProfileAvatar";
import NicknameEditableField from "@/features/user/components/mypage/NicknameEditableField";
import PasswordChangeMenuItem from "@/features/user/components/mypage/PasswordChangeMenuItem";
import TeacherRegistMenuItem from "@/features/auth/components/TeacherRegistMenuItem";
import { getYearlyStudyTime } from "@/features/study/actions";
import { buildStudyGrassMap } from "@/features/study/utils";
import StudyGrassCard from "@/features/study/components/StudyGrassCard";
import { getMyYearlyStreakAction } from "@/features/city/action";
import { buildActivityGrassMap } from "@/features/city/utils";
import ActivityGrassCard from "@/features/city/components/ActivityGrassCard";

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
    const [
        myInfoResponse,
        lectureResponse,
        pointHistoryResponse,
        studyYearlyResponse,
        activityStreakResponse,
    ] =
        await Promise.all([
            getMyInfo(),
            getLecturesWithAuth({
                enrolled: true,
                page: 1,
            }),
            getPointHistoryListAction(1),
            getYearlyStudyTime(),
            getMyYearlyStreakAction(),
        ]);

    const currentYear = new Date().getFullYear();
    const { levelByDate: studyLevelByDate, secondsByDate: studySecondsByDate } =
        buildStudyGrassMap(studyYearlyResponse.data?.records ?? []);
    const activityLevelByDate = buildActivityGrassMap(
        activityStreakResponse.data?.streaks ?? []
    );

    const userInfo = myInfoResponse.data;
    const userData = {
        name: userInfo?.name || "이름 없음",
        nickname: userInfo?.nickname || "닉네임 없음",
        email: userInfo?.email || "소셜 로그인 계정",
        profileImageUrl: userInfo?.profileImageUrl || "",
        createdAt: userInfo?.createdAt || new Date().toISOString(),
        points: userInfo?.points ?? 0,
        membership: userInfo?.membership,
        membershipUntil: userInfo?.membershipUntil,
    };
    const lectures = (lectureResponse.content ?? []) as Lecture[];
    const pointHistory = pointHistoryResponse.data?.list ?? [];
    const totalPointHistory =
        pointHistoryResponse.data?.totalElements ?? pointHistory.length;



    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-8 py-8">
            <div className="mx-auto flex w-full max-w-360 gap-6">
                <aside className="sticky top-22 z-20 mb-auto w-52 shrink-0 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="rounded-t-3xl border-b border-slate-100 p-3">
                        <div className="flex items-center gap-2.5">
                            <MyPageProfileAvatar
                                profileImageUrl={userData.profileImageUrl}
                            />

                            <div className="min-w-0 w-full flex flex-row gap-2 items-center">
                                <NicknameEditableField
                                    nickname={userData.nickname}
                                    membership={userData.membership}
                                    membershipUntil={userData.membershipUntil}
                                />
                            </div>
                        </div>

                        <div className="mt-3 rounded-lg bg-indigo-50 px-2.5 py-1 flex flex-row gap-2 items-center">
                            <p className="text-[10px] font-black text-indigo-500">
                                보유 포인트
                            </p>
                            <p className="text-sm font-black text-slate-900 ml-auto">
                                {userData.points.toLocaleString()}
                                <span className="ml-1 text-[11px] text-indigo-500">
                                    P
                                </span>
                            </p>
                            <PointGuideButton />
                        </div>
                    </div>

                    <nav className="p-1.5">
                        <ul className="flex flex-col text-xs font-bold text-slate-500">
                            <PasswordChangeMenuItem />
                            <Link href="/student/point-store">
                                <li className="cursor-pointer flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-50 hover:text-slate-900">
                                    <Store className="h-3 w-3" />
                                    포인트 상점
                                </li>
                            </Link>
                            <Link href="/student/mypage/membership">
                                <li className="cursor-pointer flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-50 hover:text-slate-900">
                                    <ShieldCheck className="h-3 w-3" />
                                    멤버십 관리
                                </li>
                            </Link>
                            <Link href="/student/mypage/payment">
                                <li className="cursor-pointer flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition hover:bg-slate-50 hover:text-slate-900">
                                    <Receipt className="h-3 w-3" />
                                    결제 내역
                                </li>
                            </Link>
                            {myInfoResponse.data?.buildings === 0 ? (
                                <TeacherRegistMenuItem nickName={userData.nickname} />
                            ) : ""}

                        </ul>
                    </nav>
                </aside>

                <section className="min-w-0 flex-1 space-y-6">
                    <section className="grid grid-cols-[2fr_3fr] items-start gap-5">
                        <div className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-2.5 flex items-center gap-2">
                                <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
                                <h2 className="text-sm font-black text-slate-900">
                                    모모민증
                                </h2>
                            </div>

                            <div className="overflow-hidden">
                                <MomoResidentCard data={userData} />
                            </div>
                        </div>

                        <div className="grid grid-rows-2 gap-3">
                            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <Leaf className="h-2.5 w-2.5 text-emerald-500" />
                                    <h2 className="text-[10px] font-black text-slate-900">
                                        학습 잔디
                                    </h2>
                                </div>
                                <div className="mt-1 flex-1 overflow-hidden">
                                    <StudyGrassCard
                                        year={currentYear}
                                        levelByDate={studyLevelByDate}
                                        secondsByDate={studySecondsByDate}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <Leaf className="h-2.5 w-2.5 text-indigo-500" />
                                    <h2 className="text-[10px] font-black text-slate-900">
                                        활동 잔디
                                    </h2>
                                </div>
                                <div className="mt-1 flex-1 overflow-hidden">
                                    <ActivityGrassCard
                                        year={currentYear}
                                        levelByDate={activityLevelByDate}
                                    />
                                </div>
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

                        <div className="scrollbar-none h-90 overflow-y-auto divide-y divide-slate-100">
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
