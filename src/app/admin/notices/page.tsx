import Link from "next/link";
import { Plus } from "lucide-react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import AdminNoticeList from "@/features/notice/components/admin/AdminNoticeList";
import { AdminNotice } from "@/features/notice/type";

interface AdminNoticesPageProps {
    searchParams: Promise<{ page?: string }>;
}

const NOTICES_PER_PAGE = 20;

const DUMMY_NOTICES: AdminNotice[] = [
    // TODO: 공지사항 전체 조회 API 응답으로 교체한다.
    { noticeId: 125, title: "MoMoCITY 서비스 점검 안내 (6/23 월요일 02:00~04:00)", createdAt: "2026-06-20", viewCount: 1248 },
    { noticeId: 124, title: "개인정보처리방침 변경 안내", createdAt: "2026-06-18", viewCount: 862 },
    { noticeId: 123, title: "강의 콘텐츠 저작권 보호 및 이용 안내", createdAt: "2026-06-15", viewCount: 573 },
    { noticeId: 122, title: "2026년 6월 신규 기능 업데이트 안내", createdAt: "2026-06-12", viewCount: 1035 },
    { noticeId: 121, title: "커뮤니티 운영 정책 개정 안내", createdAt: "2026-06-09", viewCount: 468 },
    { noticeId: 120, title: "MoMoCITY 모바일 앱 업데이트 안내", createdAt: "2026-06-07", viewCount: 721 },
    { noticeId: 119, title: "가정의 달 특별 이벤트 안내", createdAt: "2026-06-04", viewCount: 1306 },
    { noticeId: 118, title: "강의 수강 환경 개선 안내", createdAt: "2026-06-01", viewCount: 392 },
    { noticeId: 117, title: "서비스 이용약관 변경 안내", createdAt: "2026-05-28", viewCount: 654 },
    { noticeId: 116, title: "2026년 상반기 고객 만족도 조사 안내", createdAt: "2026-05-25", viewCount: 387 },
    { noticeId: 115, title: "일부 브라우저 환경 지원 종료 안내", createdAt: "2026-05-22", viewCount: 410 },
    { noticeId: 114, title: "수강평 운영 정책 안내", createdAt: "2026-05-19", viewCount: 576 },
    { noticeId: 113, title: "고객센터 문의 처리 지연 안내", createdAt: "2026-05-16", viewCount: 239 },
    { noticeId: 112, title: "로그인 보안 정책 강화 안내", createdAt: "2026-05-13", viewCount: 1083 },
    { noticeId: 111, title: "강사 강의 등록 가이드 업데이트", createdAt: "2026-05-10", viewCount: 450 },
    { noticeId: 110, title: "포인트 적립 정책 변경 안내", createdAt: "2026-05-07", viewCount: 918 },
    { noticeId: 109, title: "커뮤니티 신고 기능 개선 안내", createdAt: "2026-05-04", viewCount: 332 },
    { noticeId: 108, title: "동영상 재생 오류 조치 안내", createdAt: "2026-05-01", viewCount: 713 },
    { noticeId: 107, title: "어린이날 고객센터 휴무 안내", createdAt: "2026-04-29", viewCount: 521 },
    { noticeId: 106, title: "신규 카테고리 예술 강의 오픈 안내", createdAt: "2026-04-25", viewCount: 1422 },
    { noticeId: 105, title: "정기 시스템 점검 완료 안내", createdAt: "2026-04-22", viewCount: 635 },
];

export default async function AdminNoticesPage({
    searchParams,
}: AdminNoticesPageProps) {
    const { page } = await searchParams;
    const totalPages = Math.ceil(DUMMY_NOTICES.length / NOTICES_PER_PAGE);
    const requestedPage = Number(page) || 1;
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
    const notices = DUMMY_NOTICES.slice(
        (currentPage - 1) * NOTICES_PER_PAGE,
        currentPage * NOTICES_PER_PAGE,
    );

    return (
        <div className="mx-auto w-full max-w-360 pb-10">
            <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-1.5 rounded-full bg-indigo-500" />
                        <h1 className="text-2xl font-bold text-slate-950">공지사항</h1>
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                        서비스 운영과 관련된 공지사항을 등록하고 관리합니다.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-md bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600">
                    <Link href="/admin/notices/regist">
                        <Plus className="size-4" />
                        공지 등록
                    </Link>
                </Button>
            </div>

            <p className="mb-4 text-sm font-semibold text-slate-500">
                전체 공지사항 <span className="text-indigo-500">{DUMMY_NOTICES.length}</span>개
            </p>

            <AdminNoticeList notices={notices} />

            {totalPages > 1 && (
                <Pagination className="mt-10">
                    <div className="relative">
                        <div className="relative mx-auto w-fit">
                            {currentPage > 1 && (
                                <PaginationPrevious href={`?page=${currentPage - 1}`} className="absolute right-full top-0 mr-1 w-fit" />
                            )}
                            <PaginationContent>
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink href={`?page=${pageNumber}`} isActive={pageNumber === currentPage}>
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                            {currentPage < totalPages && (
                                <PaginationNext href={`?page=${currentPage + 1}`} className="absolute left-full top-0 ml-1 w-fit" />
                            )}
                        </div>
                    </div>
                </Pagination>
            )}
        </div>
    );
}
