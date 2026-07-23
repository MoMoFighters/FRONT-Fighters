import Link from "next/link";
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    Coins,
} from "lucide-react";

import StudentPageHeader from "@/features/student/components/StudentPageHeader";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getPointHistoryListAction } from "@/features/point/action";
import PointGuideButton from "@/features/point/components/PointGuideButton";
import {
    PointHistoryReason,
    PointHistoryTransactionType,
} from "@/features/point/type";
import { getMyInfo } from "@/features/user/action";
import { getVisiblePageNumbers } from "@/lib/pagination";

interface MypagePointPageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

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

const createPageHref = (pageNumber: number) =>
    `/student/mypage/point?page=${pageNumber}`;

export default async function MypagePointPage({
    searchParams,
}: MypagePointPageProps) {
    const { page } = await searchParams;
    const requestedPage = Math.max(Number(page) || 1, 1);

    const [myInfoResponse, pointHistoryResponse] = await Promise.all([
        getMyInfo(),
        getPointHistoryListAction(requestedPage),
    ]);

    const currentPoint = myInfoResponse.data?.points ?? 0;
    const pointHistory = pointHistoryResponse.data?.list ?? [];
    const totalElements = pointHistoryResponse.data?.totalElements ?? pointHistory.length;
    const currentPage = pointHistoryResponse.data?.page ?? requestedPage;
    const totalPages = Math.max(pointHistoryResponse.data?.totalPages ?? 1, 1);
    const pageNumbers = getVisiblePageNumbers(currentPage, totalPages);
    const hasError = pointHistoryResponse.status >= 400;

    return (
        <main className="mx-auto w-full max-w-360 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
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

            <section className="mt-8 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                    포인트 현황
                                </h1>
                                <PointGuideButton />
                            </div>

                            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                                포인트 적립 및 사용 내역을 확인할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            href="/student/point-store"
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
                                    {currentPoint.toLocaleString()}
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
                                총 {totalElements.toLocaleString()}건의 포인트 내역
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {hasError ? (
                            <div className="px-5 py-10 text-center text-sm font-bold text-rose-500">
                                {pointHistoryResponse.message}
                            </div>
                        ) : pointHistory.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm font-bold text-slate-400">
                                포인트 사용 내역이 없습니다.
                            </div>
                        ) : (
                            pointHistory.map((item, index) => {
                                const isIncrease = item.type === "GAINED";

                                return (
                                    <div
                                        key={`${item.createdAt}-${item.reason}-${index}`}
                                        className="grid grid-cols-1 items-center gap-2 px-5 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(70px,1fr)_minmax(0,3fr)_minmax(70px,1fr)] sm:gap-4"
                                    >
                                        <p className="text-xs font-bold text-slate-500">
                                            {formatDateTime(item.createdAt)}
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
                                                    {POINT_REASON_LABEL[item.reason] ?? item.reason}
                                                </p>
                                                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                                    {POINT_TYPE_LABEL[item.type] ?? item.type}
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
                                            {Math.abs(item.amount).toLocaleString()} P
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {totalPages > 1 && !hasError && (
                    <Pagination className="mt-10">
                        <div className="relative">
                            <div className="relative mx-auto w-fit">
                                {currentPage > 1 && (
                                    <PaginationPrevious
                                        href={createPageHref(currentPage - 1)}
                                        className="absolute right-full top-0 mr-1 w-fit"
                                    />
                                )}

                                <PaginationContent>
                                    {pageNumbers.map((pageNumber) => (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href={createPageHref(pageNumber)}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>

                                {currentPage < totalPages && (
                                    <PaginationNext
                                        href={createPageHref(currentPage + 1)}
                                        className="absolute left-full top-0 ml-1 w-fit"
                                    />
                                )}
                            </div>
                        </div>
                    </Pagination>
                )}
            </section>
        </main>
    );
}
