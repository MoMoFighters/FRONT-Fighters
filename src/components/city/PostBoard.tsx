"use client";

import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { useEffect, useMemo, useState } from "react";
import postBoard from "@/app/assets/img/guestBook.png";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import GuestBookItem, { GuestBookListItem } from "../postboard/GuestBookItem";
import StudentNoticeItem from "../postboard/StudentNoticeItem";
import GuestbookForm from "@/features/guestbook/GuestbookForm";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import { getNoticeAction, getNoticesAction } from "@/features/notice/action";
import { Notice, NoticeListResponse } from "@/features/notice/type";
import { getGuestbooksAction } from "@/features/guestbook/action";
import {
    CreateGuestbookResponse,
    GuestbookListItem,
} from "@/features/guestbook/type";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface PostBoardProps {
    mode: "MY" | "FRIEND";
    ownerId?: number;
    initialGuestbooks?: GuestbookListItem[];
    variant?: "desktop" | "mobile";
}

type PostBoardMode = "guestbook" | "notice";
type PanelView = "list" | "guestbook-form" | "guestbook-detail" | "notice-detail";

interface GuestBookDetail extends GuestBookListItem {
    visitorProfileImageUrl: string | null;
}

const PAGE_SIZE = 9;

const EMPTY_NOTICE_RESPONSE: NoticeListResponse = {
    items: [],
    page: 1,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
};

const paginate = <T,>(items: T[], page: number) =>
    items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

const getTotalPages = (totalCount: number) =>
    Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);

const normalizeNoticeContent = (content?: string) => {
    if (!content) {
        return ["공지사항 내용을 확인해주세요."];
    }

    const paragraphs = content
        .split(/\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return paragraphs.length > 0 ? paragraphs : [content];
};

const toGuestbookDetail = (
    guestbook: GuestbookListItem
): GuestBookDetail => ({
    guestbookId: guestbook.bookId,
    writerName: guestbook.nickname,
    visitorProfileImageUrl: null,
    content: guestbook.content,
    createdAt: guestbook.createdAt,
});

const toCreatedGuestbookDetail = (
    guestbook: CreateGuestbookResponse
): GuestBookDetail => ({
    guestbookId: guestbook.bookId,
    writerName: guestbook.nickname,
    visitorProfileImageUrl: null,
    content: guestbook.content,
    createdAt: guestbook.createdAt,
});

export default function PostBoard({ mode, ownerId, initialGuestbooks = [], variant = "desktop" }: PostBoardProps) {
    const [isModal, setIsModal] = useState(false);
    const [nav, setNav] = useState<PostBoardMode>("guestbook");
    const [panelView, setPanelView] = useState<PanelView>("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [guestbooks, setGuestbooks] = useState<GuestBookDetail[]>(
        () => initialGuestbooks.map(toGuestbookDetail)
    );
    const [noticeResponse, setNoticeResponse] =
        useState<NoticeListResponse>(EMPTY_NOTICE_RESPONSE);
    const [isGuestbookLoading, setIsGuestbookLoading] = useState(false);
    const [isNoticeLoading, setIsNoticeLoading] = useState(false);
    const [selectedGuestbook, setSelectedGuestbook] =
        useState<GuestBookDetail | null>(null);
    const [selectedNotice, setSelectedNotice] =
        useState<Notice | null>(null);

    const guestbookTotalPages = getTotalPages(guestbooks.length);
    const noticeTotalPages = Math.max(noticeResponse.totalPages || 1, 1);

    const visibleGuestbooks = useMemo(
        () => paginate(guestbooks, currentPage),
        [guestbooks, currentPage]
    );

    const notices = noticeResponse.items;

    const shouldCompactGuestbookGrid = visibleGuestbooks.length <= 6;

    const resetToList = () => {
        setPanelView("list");
        setSelectedGuestbook(null);
        setSelectedNotice(null);
    };

    const loadGuestbooks = async () => {
        setIsGuestbookLoading(true);

        try {
            const response = await getGuestbooksAction(
                mode === "FRIEND" ? ownerId : undefined
            );

            if (response.status >= 400) {
                toast.error(response.message);
                setGuestbooks([]);
                return;
            }

            setGuestbooks((response.data ?? []).map(toGuestbookDetail));
        } finally {
            setIsGuestbookLoading(false);
        }
    };

    useEffect(() => {
        if (!isModal || panelView !== "list") {
            return;
        }

        if (nav === "guestbook" && mode === "MY") {
            const timeoutId = window.setTimeout(() => {
                void loadGuestbooks();
            }, 0);

            return () => {
                window.clearTimeout(timeoutId);
            };
        }
    }, [isModal, nav, panelView, mode]);

    useEffect(() => {
        if (!isModal || nav !== "notice" || panelView !== "list") {
            return;
        }

        let isCurrent = true;

        const loadNotices = async () => {
            setIsNoticeLoading(true);

            try {
                const response = await getNoticesAction(currentPage);

                if (isCurrent) {
                    setNoticeResponse(response);
                }
            } finally {
                if (isCurrent) {
                    setIsNoticeLoading(false);
                }
            }
        };

        void loadNotices();

        return () => {
            isCurrent = false;
        };
    }, [isModal, nav, panelView, currentPage]);

    const handleChangeNav = (nextNav: PostBoardMode) => {
        setNav(nextNav);
        setCurrentPage(1);
        resetToList();
    };

    const handleSelectGuestbook = (guestbookId: number) => {
        const guestbook =
            guestbooks.find((item) => item.guestbookId === guestbookId) ?? null;

        setSelectedGuestbook(guestbook);
        setPanelView("guestbook-detail");
    };

    const handleSelectNotice = (noticeId: number) => {
        const notice = notices.find((item) => item.noticeId === noticeId) ?? null;

        setSelectedNotice(notice);
        setPanelView("notice-detail");
    };

    const handleCloseModal = () => {
        setIsModal(false);
        resetToList();
    };

    const handleGuestbookSubmitSuccess = (guestbook: CreateGuestbookResponse) => {
        const createdGuestbook = toCreatedGuestbookDetail(guestbook);

        setSelectedGuestbook(createdGuestbook);
        setPanelView("guestbook-detail");
        setCurrentPage(1);

        void loadGuestbooks();
    };

    return (
        <>
            {variant === "mobile" ? (
                <button
                    type="button"
                    onClick={() => setIsModal(true)}
                    className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-black text-slate-900">
                            {mode === "MY" ? "방명록/공지사항" : "방명록"}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                            {mode === "MY"
                                ? "방명록과 공지사항을 확인해보세요."
                                : "친구에게 방명록을 남겨보세요."}
                        </p>
                    </div>
                </button>
            ) : (
                <div className="absolute bottom-[11%] left-[44%] z-10 aspect-square w-[7%]">
                    <HoverCard openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <div
                                className="h-full w-full cursor-pointer"
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
                        <HoverCardContent side="top" align="center" sideOffset={8}>
                            <div className="space-y-1 -top-20">
                                <p className="text-sm font-bold text-slate-900">
                                    게시판
                                </p>
                                <p className="text-xs font-medium text-slate-500">
                                    {mode === "MY"
                                        ? "방명록과 공지사항을 확인해보세요."
                                        : "친구에게 방명록을 남겨보세요."}
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <span className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[0.3cqw] bg-white px-[0.4cqw] py-[0.08cqw] text-[0.75cqw] font-bold text-slate-700 shadow-sm">
                        게시판
                    </span>
                </div>
            )}

            {isModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative flex h-[80vh] w-[92vw] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-950/25 md:w-[60vw]"
                        onClick={(event) => event.stopPropagation()}
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
                                {mode === "MY" ? "게시판" : "방명록"}
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-400">
                                {mode === "MY"
                                    ? "친구가 남긴 방명록과 서비스 공지사항을 확인해보세요."
                                    : "친구에게 방명록을 남겨보세요."}
                            </p>
                        </div>

                        <div className="mb-3 mt-2 mr-2 flex flex-row gap-2">
                            {mode === "MY" ? (
                                <div className="mb-1 ml-2 flex flex-1 gap-8 border-b border-slate-200">
                                    <button
                                        type="button"
                                        className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === "guestbook"
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            }`}
                                        onClick={() => handleChangeNav("guestbook")}
                                    >
                                        방명록
                                    </button>
                                    <button
                                        type="button"
                                        className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition ${nav === "notice"
                                            ? "border-indigo-400 text-indigo-500"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                            }`}
                                        onClick={() => handleChangeNav("notice")}
                                    >
                                        공지사항
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1" />
                            )}

                            {mode === "FRIEND" ? (
                                <Button
                                    type="button"
                                    className="cursor-pointer rounded-xl bg-indigo-500 py-4 text-xs font-black hover:bg-indigo-600"
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
                                    ownerId={ownerId}
                                    onCancel={resetToList}
                                    onSubmitSuccess={handleGuestbookSubmitSuccess}
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
                                    noticeId={selectedNotice.noticeId}
                                    onBack={resetToList}
                                />
                            )}

                            {panelView === "list" && nav === "guestbook" && (
                                <BoardListLayout
                                    totalPages={guestbookTotalPages}
                                    currentPage={currentPage}
                                    onChangePage={setCurrentPage}
                                >
                                    <div className={`grid grid-cols-1 gap-2 px-1 pt-1 pb-3 sm:grid-cols-3 ${shouldCompactGuestbookGrid
                                        ? "content-start"
                                        : "min-h-76 content-between"
                                        }`}
                                    >
                                        {isGuestbookLoading ? (
                                            <GuestbookGridSkeleton />
                                        ) : visibleGuestbooks.length === 0 ? (
                                            <EmptyBoardMessage message="남겨진 방명록 내역이 없어요." />
                                        ) : visibleGuestbooks.map((guestbook) => (
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
                                    currentPage={currentPage}
                                    onChangePage={setCurrentPage}
                                >
                                    <div className="grid grid-cols-1 gap-2 px-1 pt-1 pb-3">
                                        {isNoticeLoading ? (
                                            <NoticeListSkeleton />
                                        ) : notices.length === 0 ? (
                                            <EmptyBoardMessage message="등록된 공지사항이 없습니다." />
                                        ) : notices.map((notice) => (
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

function GuestbookGridSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="flex h-24 w-full flex-col justify-between rounded-2xl border border-indigo-100 bg-white p-3"
                >
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            ))}
        </>
    );
}

function NoticeListSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-3"
                >
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </>
    );
}

function EmptyBoardMessage({ message }: { message: string }) {
    return (
        <div className="col-span-full flex h-40 items-center justify-center text-sm font-bold text-slate-400">
            {message}
        </div>
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
    const safeTotalPages = Math.max(totalPages, 1);

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
                    {currentPage} / {safeTotalPages}
                </p>

                <button
                    type="button"
                    disabled={currentPage >= safeTotalPages}
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
                        {guestbook.createdAt.split('T')[0]}
                        <span className="ml-1">{guestbook.createdAt.split('T')[1]}</span>
                    </time>
                </div>
            </div>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-2xl bg-slate-50 p-4 scrollbar-hidden">
                <p className="whitespace-pre-line text-sm font-bold leading-7 text-slate-700">
                    {guestbook.content}
                </p>
            </div>
        </div>
    );
}

function NoticeDetailView({
    noticeId,
    onBack,
}: {
    noticeId: number;
    onBack: () => void;
}) {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        const loadNotice = async () => {
            setIsLoading(true);

            try {
                const response = await getNoticeAction(noticeId);

                if (isCurrent) {
                    setNotice(response);
                }
            } finally {
                if (isCurrent) {
                    setIsLoading(false);
                }
            }
        };

        void loadNotice();

        return () => {
            isCurrent = false;
        };
    }, [noticeId]);

    const content = normalizeNoticeContent(notice?.content);

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
                    {notice?.title ?? (isLoading ? "불러오는 중입니다." : "공지사항")}
                </h3>

                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-slate-400">
                    {notice?.createdAt ? <time>{notice.createdAt}</time> : null}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-slate-50 p-4 scrollbar-hidden">
                <div className="space-y-3 text-sm font-bold leading-7 text-slate-700">
                    {isLoading ? (
                        <p>공지사항 내용을 불러오는 중입니다.</p>
                    ) : content.map((paragraph, index) => (
                        <p key={index}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
