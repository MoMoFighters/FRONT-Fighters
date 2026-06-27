import Link from "next/link";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    Coins,
} from "lucide-react";

import MyPageNav from "@/components/mypage/MyPageNav";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import NicknameInputModal from "@/features/auth/components/NicknameInputModal";

type PointHistoryType =
    | "LECTURE_REWARD"
    | "ATTENDANCE"
    | "EVENT"
    | "PURCHASE"
    | "REFUND";

interface PointHistoryItem {
    id: number;
    createdAt: string;
    type: PointHistoryType;
    value: number;
}

interface MypagePointPageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

const POINT_TYPE_LABEL: Record<PointHistoryType, string> = {
    LECTURE_REWARD: "강의 수강 보상",
    ATTENDANCE: "출석 보상",
    EVENT: "이벤트 적립",
    PURCHASE: "포인트 사용",
    REFUND: "결제 환불",
};

const POINT_HISTORY: PointHistoryItem[] = [
    {
        id: 1,
        createdAt: "2026.04.04 04:44",
        type: "LECTURE_REWARD",
        value: 500,
    },
    {
        id: 2,
        createdAt: "2026.04.05 10:12",
        type: "ATTENDANCE",
        value: 120,
    },
    {
        id: 3,
        createdAt: "2026.04.07 18:30",
        type: "PURCHASE",
        value: -800,
    },
    {
        id: 4,
        createdAt: "2026.04.11 09:20",
        type: "EVENT",
        value: 1000,
    },
    {
        id: 5,
        createdAt: "2026.04.13 21:08",
        type: "REFUND",
        value: 300,
    },
    {
        id: 6,
        createdAt: "2026.04.15 13:35",
        type: "LECTURE_REWARD",
        value: 450,
    },
    {
        id: 7,
        createdAt: "2026.04.18 08:10",
        type: "PURCHASE",
        value: -300,
    },
];

const CURRENT_POINT = 3200;
const PAGE_SIZE = 5;

const createPageHref = (pageNumber: number) =>
    `/student/mypage/point?page=${pageNumber}`;

export default async function MypagePointPage({
    searchParams,
}: MypagePointPageProps) {

    const cookie = await cookies();
    const token = cookie.get('accessToken')?.value;
    var decoded;

    if (token) {
        // 옵션 없이 사용하면 페이로드(내용)를 디코딩합니다.
        decoded = jwtDecode(token);
        console.log(decoded);
    }


    const { page } = await searchParams;

    const totalPages = Math.ceil(POINT_HISTORY.length / PAGE_SIZE);
    const currentPage = Math.min(
        Math.max(Number(page) || 1, 1),
        totalPages
    );
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pointHistoryPage = POINT_HISTORY.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    return (
        <main className="mx-auto w-full max-w-360 px-12 py-12">
            <NicknameInputModal nickIsNull={decoded?.roles === "STUDENT"} />
            <StudentPageHeader
                backHref="/student/mypage"
                breadcrumbs={[
                    {
                        label: "홈",
                        href: "/student",
                    },
                    {
                        label: "마이페이지",
                        href: "/student/mypage",
                    },
                    {
                        label: "포인트",
                    },
                ]}
                title="포인트"
            />

            <MyPageNav />

            <section className="mt-8 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                포인트 현황
                            </h1>

                            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                                포인트 적립 및 사용 내역을 확인할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            href="/student"
                            className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-indigo-500 transition-colors hover:text-indigo-600"
                        >
                            포인트 사용하러 가기
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-md shadow-indigo-200">
                                <Coins className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-500">
                                    현재 보유 포인트
                                </p>
                                <p className="mt-0.5 text-3xl font-black tracking-tight text-slate-900">
                                    {CURRENT_POINT.toLocaleString()}
                                    <span className="ml-1.5 text-lg text-indigo-500">
                                        P
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-black text-slate-900">
                                포인트 내역
                            </h2>
                            <p className="mt-1 text-xs font-medium text-slate-400">
                                일시, 획득처, 변화량을 확인하세요.
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {/* ==================== POINT_HISTORY_ITEM_COMPONENT_START ==================== */}
                        {/* TODO: 아래 포인트 내역 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                        {pointHistoryPage.map((item) => {
                            const isIncrease = item.value > 0;

                            return (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[160px_minmax(0,1fr)_120px] items-center gap-4 px-5 py-3 transition-colors hover:bg-slate-50"
                                >
                                    <p className="text-xs font-semibold text-slate-500">
                                        {item.createdAt}
                                    </p>

                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isIncrease
                                                ? "bg-indigo-50 text-indigo-500"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {isIncrease ? (
                                                <ArrowDownLeft className="h-4 w-4" />
                                            ) : (
                                                <ArrowUpRight className="h-4 w-4" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {POINT_TYPE_LABEL[item.type]}
                                            </p>
                                            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                                {item.type}
                                            </p>
                                        </div>
                                    </div>

                                    <p
                                        className={`text-right text-base font-black ${isIncrease
                                            ? "text-indigo-500"
                                            : "text-rose-500"
                                            }`}
                                    >
                                        {isIncrease ? "+" : "-"}
                                        {Math.abs(item.value).toLocaleString()} P
                                    </p>
                                </div>
                            );
                        })}
                        {/* TODO: 위 포인트 내역 아이템은 추후 별도 컴포넌트로 분리 예정 */}
                        {/* ===================== POINT_HISTORY_ITEM_COMPONENT_END ===================== */}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={createPageHref(currentPage - 1)}
                                        text="이전"
                                    />
                                </PaginationItem>
                            )}

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href={createPageHref(pageNumber)}
                                        isActive={pageNumber === currentPage}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={createPageHref(currentPage + 1)}
                                        text="다음"
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </section>
        </main>
    );
}
