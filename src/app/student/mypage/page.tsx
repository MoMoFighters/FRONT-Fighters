import { Suspense } from "react";
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
import MobileSidebarToggle from "@/components/common/MobileSidebarToggle";
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

const GrassSkeleton = () => (
    <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
);

const ListSkeleton = () => (
    <div className="space-y-3 px-6 py-5">
        {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
    </div>
);

export default async function StudentMyPage() {
    const myInfoResponse = await getMyInfo();
    const currentYear = new Date().getFullYear();

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

    return (
        <main className="min-h-[calc(100vh-137px)] bg-white px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex w-full max-w-360 flex-col gap-6 md:flex-row">
                <MobileSidebarToggle>
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
                </MobileSidebarToggle>

                <section className="min-w-0 flex-1 space-y-6">
                    <section className="flex flex-col gap-5 md:flex-row md:items-start">
                        {/* 모바일은 w-full로 폭에 맞춰 비율 그대로 축소. md 이상에서는 잔디 컬럼과 1.4:1 비율로 계속 같이 줄어들되,
                            524px(잔디 높이 340px와 맞춰 계산해둔 값)를 최대치로 그 이상은 안 커지게 상한만 둔다 */}
                        <div className="relative z-0 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:max-w-[524px] md:basis-0 md:flex-[1.4]">
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

                        {/* [변경] 높이는 폭과 무관하게 항상 340px(잔디는 7줄 고정이라 안 줄어듦), md 이상에서만 flex-1로 남는 폭을 채움 */}
                        <div className="grid h-[340px] min-w-0 grid-rows-2 gap-3 md:flex-1">
                            <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <Leaf className="h-2.5 w-2.5 text-emerald-500" />
                                    <h2 className="text-[10px] font-black text-slate-900">
                                        학습 잔디
                                    </h2>
                                </div>
                                <div className="mt-1 min-w-0 min-h-0 flex-1 overflow-hidden">
                                    <Suspense fallback={<GrassSkeleton />}>
                                        <StudyGrassSection year={currentYear} />
                                    </Suspense>
                                </div>
                            </div>

                            <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <Leaf className="h-2.5 w-2.5 text-indigo-500" />
                                    <h2 className="text-[10px] font-black text-slate-900">
                                        활동 잔디
                                    </h2>
                                </div>
                                <div className="mt-1 min-w-0 min-h-0 flex-1 overflow-hidden">
                                    <Suspense fallback={<GrassSkeleton />}>
                                        <ActivityGrassSection year={currentYear} />
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-5">
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
                        </div>

                        {/* 모바일은 이중 스크롤이 불편해서 min-height만 두고 페이지 자체 스크롤을 따라가게 하고, md 이상에서만 고정 높이+내부 스크롤 유지 */}
                        <div className="scrollbar-none min-h-110 overflow-visible md:h-110 md:overflow-y-auto">
                            <Suspense fallback={<ListSkeleton />}>
                                <LectureListSection />
                            </Suspense>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-5">
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-indigo-500" />
                                <h2 className="text-lg font-black text-slate-900">
                                    포인트 내역
                                </h2>
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

                        <Suspense fallback={<ListSkeleton />}>
                            <PointHistorySection />
                        </Suspense>
                    </section>
                </section>
            </div>
        </main>
    );
}

async function StudyGrassSection({ year }: { year: number }) {
    const studyYearlyResponse = await getYearlyStudyTime();
    const { levelByDate, secondsByDate } = buildStudyGrassMap(
        studyYearlyResponse.data?.records ?? []
    );

    return (
        <StudyGrassCard
            year={year}
            levelByDate={levelByDate}
            secondsByDate={secondsByDate}
        />
    );
}

async function ActivityGrassSection({ year }: { year: number }) {
    const activityStreakResponse = await getMyYearlyStreakAction();
    const levelByDate = buildActivityGrassMap(
        activityStreakResponse.data?.streaks ?? []
    );

    return <ActivityGrassCard year={year} levelByDate={levelByDate} />;
}

async function LectureListSection() {
    const lectureResponse = await getLecturesWithAuth({
        enrolled: true,
        page: 1,
    });
    const lectures = (lectureResponse.content ?? []) as Lecture[];

    if (lectures.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <BookOpen className="h-10 w-10" />
                <p className="mt-3 text-sm font-black">
                    아직 수강 중인 강의가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <>
            {lectures.map((lecture) => (
                <StudentLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    href={`/student/mypage/lectures/${lecture.lectureId}`}
                    showLearningStatus
                />
            ))}
        </>
    );
}

async function PointHistorySection() {
    const pointHistoryResponse = await getPointHistoryListAction(1);
    const pointHistory = pointHistoryResponse.data?.list ?? [];
    const totalPointHistory =
        pointHistoryResponse.data?.totalElements ?? pointHistory.length;

    return (
        <>
            <p className="px-6 pt-3 text-xs font-bold text-slate-400">
                총 {totalPointHistory.toLocaleString()}건의 포인트 내역
            </p>

            {/* 모바일은 이중 스크롤이 불편해서 min-height만 두고 페이지 자체 스크롤을 따라가게 하고, md 이상에서만 고정 높이+내부 스크롤 유지 */}
            <div className="scrollbar-none min-h-90 overflow-visible divide-y divide-slate-100 md:h-90 md:overflow-y-auto">
                {pointHistory.length > 0 ? (
                    pointHistory.map((item, index) => {
                        const isIncrease = item.type === "GAINED";

                        return (
                            <div
                                key={`${item.createdAt}-${item.reason}-${index}`}
                                className="grid grid-cols-1 items-start gap-1 px-4 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(60px,1fr)_minmax(0,3fr)_minmax(60px,1fr)] sm:items-center sm:gap-3 sm:px-5 sm:py-2.5"
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
                                        {/* [변경] 모바일에서는 생략(색상+부호로 이미 증가/감소가 구분됨), sm 이상에서만 표시 */}
                                        <p className="hidden text-[10px] font-bold text-slate-400 sm:block">
                                            {POINT_TYPE_LABEL[item.type] ??
                                                item.type}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    className={`text-left text-sm font-black sm:text-right ${isIncrease
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
        </>
    );
}
