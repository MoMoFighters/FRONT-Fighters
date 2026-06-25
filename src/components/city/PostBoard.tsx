'use client'

import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { useEffect, useMemo, useState } from "react";
import postBoard from "@/app/assets/img/guestBook.png"
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import GuestBookItem, { GuestBookListItem } from "../postboard/GuestBookItem";
import StudentNoticeItem, { StudentNoticeListItem } from "../postboard/StudentNoticeItem";
import GuestbookForm from "@/features/postboard/GuestbookForm";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";

interface PostBoardProps {
    mode: "MY" | "FRIEND";
}

type PostBoardMode = "guestbook" | "notice";
type PanelView = "list" | "guestbook-form" | "guestbook-detail" | "notice-detail";

interface GuestBookDetail extends GuestBookListItem {
    visitorProfileImageUrl: string | null;
}

interface StudentNoticeDetail extends StudentNoticeListItem {
    content: string[];
}

const PAGE_SIZE = 9;

const DUMMY_GUESTBOOKS: GuestBookDetail[] = Array.from({ length: 23 }).map((_, index) => ({
    guestbookId: index + 1,
    writerName: index % 2 === 0 ? "피치러버" : "도시친구",
    visitorProfileImageUrl: null,
    content: [
        "오늘 도시 구경 잘 하고 갑니다. 광장 분위기가 너무 좋아요!",
        "새로 생긴 건물이 잘 어울려서 다음에 또 놀러올게요.",
        "수업 열심히 듣는 흔적이 보여서 괜히 자극받고 갑니다.",
    ][index % 3],
    createdAt: `2026.06.${String(25 - (index % 20)).padStart(2, "0")}`,
}));

const DUMMY_NOTICES: StudentNoticeDetail[] = Array.from({ length: 14 }).map((_, index) => ({
    noticeId: index + 1,
    title: [
        "MoMoCITY 정기 점검 안내",
        "방명록 이용 정책 안내",
        "친구 도시 방문 기능 업데이트",
        "커뮤니티 신고 기능 개선 안내",
    ][index % 4],
    summary: "서비스 이용에 필요한 주요 안내사항을 확인해주세요.",
    content: [
        "MoMoCITY 서비스 안정화를 위해 정기 점검이 진행될 예정입니다.",
        "점검 시간 동안 일부 기능 이용이 제한될 수 있습니다.",
        "더 나은 이용 경험을 위해 계속 개선하겠습니다.",
    ],
    createdAt: `2026.06.${String(24 - (index % 18)).padStart(2, "0")}`,
    viewCount: 120 + index * 37,
}));

const paginate = <T,>(
    items: T[],
    page: number
) => items.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
);

export default function PostBoard({ mode }: PostBoardProps) {

    const [isModal, setIsModal] = useState(false);
    const [nav, setNav] = useState<PostBoardMode>('guestbook');
    const [panelView, setPanelView] = useState<PanelView>("list");
    const [guestbookPage, setGuestbookPage] = useState(1);
    const [noticePage, setNoticePage] = useState(1);
    const [selectedGuestbook, setSelectedGuestbook] =
        useState<GuestBookDetail | null>(null);
    const [selectedNotice, setSelectedNotice] =
        useState<StudentNoticeDetail | null>(null);

    const guestbookTotalPages =
        Math.ceil(DUMMY_GUESTBOOKS.length / PAGE_SIZE);

    const noticeTotalPages =
        Math.ceil(DUMMY_NOTICES.length / PAGE_SIZE);

    const guestbooks = useMemo(() => {
        return paginate(
            DUMMY_GUESTBOOKS,
            guestbookPage
        );
    }, [guestbookPage]);

    const notices = useMemo(() => {
        return paginate(
            DUMMY_NOTICES,
            noticePage
        );
    }, [noticePage]);

    const shouldCompactGuestbookGrid =
        guestbooks.length <= 6;

    useEffect(() => {
        if (!isModal) {
            return;
        }

        if (nav === 'guestbook') {
            // TODO: 방명록 목록조회 API 연결 지점
            // page, size를 넘기고 받은 목록을 GuestBookItem에 내려주면 됨.
        }
        else {
            // TODO: 공지사항 목록조회 API 연결 지점
            // page, size를 넘기고 받은 목록을 StudentNoticeItem에 내려주면 됨.
        }
    }, [isModal, nav, guestbookPage, noticePage])

    const resetToList = () => {
        setPanelView("list");
        setSelectedGuestbook(null);
        setSelectedNotice(null);
    };

    const handleChangeNav = (nextNav: PostBoardMode) => {
        setNav(nextNav);
        resetToList();
    };

    const handleSelectGuestbook = (guestbookId: number) => {
        // TODO: 방명록 단건조회 API 연결 지점
        // guestbookId로 상세 조회 후 setSelectedGuestbook(response.data)
        const guestbook =
            DUMMY_GUESTBOOKS.find((item) => item.guestbookId === guestbookId) ?? null;

        setSelectedGuestbook(guestbook);
        setPanelView("guestbook-detail");
    };

    const handleSelectNotice = (noticeId: number) => {
        const notice =
            DUMMY_NOTICES.find((item) => item.noticeId === noticeId) ?? null;

        setSelectedNotice(notice);
        setPanelView("notice-detail");
    };

    const handleCloseModal = () => {
        setIsModal(false);
        resetToList();
    };

    return (
        <>
            <HoverCard
                openDelay={50}
                closeDelay={50}
            >
                <HoverCardTrigger asChild>
                    <div
                        className="absolute bottom-[11%] left-[44%] z-10 aspect-square w-[7%] cursor-pointer"
                        style={{
                            transform: "rotate(-17deg) skewX(-15deg) scaleY(0.92)",
                            transformOrigin: "center",
                        }}
                        onClick={() => setIsModal(true)}
                    >
                        <div className="relative h-full w-full transition-transform duration-200 hover:scale-110">
                            <Image
                                src={postBoard}
                                alt="게시판"
                                fill
                                quality={80}
                                sizes="7vw"
                            />
                        </div>
                    </div>
                </HoverCardTrigger>
                <HoverCardContent
                    side="top"
                    align="center"
                    sideOffset={8}
                >
                    <div className="space-y-1 -top-20">
                        <p className="text-sm font-bold text-slate-900">
                            게시판
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                            {mode === "MY" ? "방명록과 공지사항을 확인해보세요." : "친구에게 방명록을 남겨보세요."}
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>

            {isModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative flex h-140 w-[60vw] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-950/25"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="닫기"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-1 pr-10">

                            <h2 className="text-2xl font-black text-slate-900">
                                게시판
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-400">
                                친구가 남긴 방명록과 서비스 공지사항을 확인해보세요.
                            </p>
                        </div>

                        <div className="mb-3 mt-2 mr-2 flex flex-row gap-2">
                            {mode === "MY" ? (
                                <div className="mb-1 ml-2 flex flex-1 gap-8 border-b border-slate-200">
                                    <button
                                        type="button"
                                        className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === 'guestbook'
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            }`}
                                        onClick={() => handleChangeNav('guestbook')}
                                    >
                                        방명록
                                    </button>
                                    <button
                                        type="button"
                                        className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === 'notice'
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            }`}
                                        onClick={() => handleChangeNav('notice')}
                                    >
                                        공지사항
                                    </button>
                                </div>
                            ) : <div className="flex-1" />}

                            {mode === 'FRIEND' ? (
                                <Button
                                    type="button"
                                    className="cursor-pointer rounded-xl bg-indigo-500 py-4 font-black hover:bg-indigo-600"
                                    onClick={() => setPanelView("guestbook-form")}
                                >
                                    <Plus />
                                    방명록 작성
                                </Button>
                            ) : null}
                        </div>

                        <div className="h-101 min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                            {panelView === "guestbook-form" && (
                                <GuestbookForm
                                    onCancel={resetToList}
                                    onSubmitSuccess={resetToList}
                                />
                            )}

                            {panelView === "guestbook-detail" && selectedGuestbook && (
                                <GuestbookDetailView
                                    guestbook={selectedGuestbook}
                                    onBack={resetToList}
                                />
                            )}

                            {panelView === "notice-detail" && selectedNotice && (
                                <NoticeDetailView
                                    notice={selectedNotice}
                                    onBack={resetToList}
                                />
                            )}

                            {panelView === "list" && nav === "guestbook" && (
                                <BoardListLayout
                                    totalPages={guestbookTotalPages}
                                    currentPage={guestbookPage}
                                    onChangePage={setGuestbookPage}
                                >
                                    <div className={`grid grid-cols-3 gap-2 px-1 pt-1 pb-3 ${shouldCompactGuestbookGrid
                                        ? "content-start"
                                        : "min-h-76 content-between"
                                        }`}>
                                        {guestbooks.map((guestbook) => (
                                            <GuestBookItem
                                                key={guestbook.guestbookId}
                                                guestbook={guestbook}
                                                onClick={handleSelectGuestbook}
                                            />
                                        ))}
                                    </div>
                                </BoardListLayout>
                            )}

                            {panelView === "list" && nav === "notice" && (
                                <BoardListLayout
                                    totalPages={noticeTotalPages}
                                    currentPage={noticePage}
                                    onChangePage={setNoticePage}
                                >
                                    <div className="grid grid-cols-1 gap-2 px-1 pt-1 pb-3">
                                        {notices.map((notice) => (
                                            <StudentNoticeItem
                                                key={notice.noticeId}
                                                notice={notice}
                                                onClick={handleSelectNotice}
                                            />
                                        ))}
                                    </div>
                                </BoardListLayout>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function BoardListLayout({
    children,
    currentPage,
    totalPages,
    onChangePage,
}: {
    children: React.ReactNode;
    currentPage: number;
    totalPages: number;
    onChangePage: (page: number) => void;
}) {
    return (
        <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hidden">
                {children}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onChangePage(currentPage - 1)}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <p className="min-w-16 text-center text-xs font-black text-slate-500">
                    {currentPage} / {totalPages}
                </p>

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onChangePage(currentPage + 1)}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function GuestbookDetailView({
    guestbook,
    onBack,
}: {
    guestbook: GuestBookDetail;
    onBack: () => void;
}) {
    return (
        <div className="flex h-full flex-col rounded-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer text-sm font-black text-slate-400 transition hover:text-slate-800"
                >
                    목록보기
                </button>

                <CreateReportBtn
                    triggerLabel="신고"
                    triggerClassName="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-black text-rose-500 transition hover:bg-rose-50"
                />
            </div>

            <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-black text-indigo-500">
                    {guestbook.visitorProfileImageUrl ? (
                        <img
                            src={guestbook.visitorProfileImageUrl}
                            alt={`${guestbook.writerName} 프로필`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        guestbook.writerName.slice(0, 1)
                    )}
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900">
                        {guestbook.writerName}
                    </p>
                    <time className="text-xs font-bold text-slate-400">
                        {guestbook.createdAt}
                    </time>
                </div>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-2xl bg-slate-50 p-4 scrollbar-hidden">
                <p className="whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">
                    {guestbook.content}
                </p>
            </div>
        </div>
    );
}

function NoticeDetailView({
    notice,
    onBack,
}: {
    notice: StudentNoticeDetail;
    onBack: () => void;
}) {
    return (
        <div className="flex h-full flex-col rounded-2xl bg-white p-5">
            <div className="mb-4 border-b border-slate-100 pb-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-3 cursor-pointer text-sm font-black text-slate-400 transition hover:text-slate-800"
                >
                    목록보기
                </button>

                <h3 className="text-xl font-black text-slate-900">
                    {notice.title}
                </h3>

                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-slate-400">
                    <time>{notice.createdAt}</time>
                    <span>조회 {notice.viewCount.toLocaleString()}</span>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-slate-50 p-4 scrollbar-hidden">
                <div className="space-y-3 text-sm font-semibold leading-7 text-slate-700">
                    {notice.content.map((paragraph, index) => (
                        <p key={index}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
