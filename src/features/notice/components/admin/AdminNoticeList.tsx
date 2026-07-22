"use client";

import { Pin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { deleteNoticeAction, updateNoticePinAction } from "@/features/notice/action";
import { Notice } from "@/features/notice/type";

interface AdminNoticeListProps {
    notices: Notice[];
}

export default function AdminNoticeList({ notices: initialNotices }: AdminNoticeListProps) {
    const router = useRouter();
    const notices = initialNotices;
    const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);
    const [pinTarget, setPinTarget] = useState<Notice | null>(null);
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isPinning, startPinTransition] = useTransition();

    const isAllSelected =
        notices.length > 0 && selectedNoticeIds.length === notices.length;

    const selectedCount = selectedNoticeIds.length;

    const pinnedNotice = useMemo(
        () => notices.find((notice) => notice.isPinned),
        [notices],
    );

    const selectedTitle = useMemo(
        () => selectedCount > 0
            ? `${selectedCount}개 공지사항을 삭제하시겠습니까?`
            : "공지사항을 선택해주세요.",
        [selectedCount],
    );

    const toggleAll = (selected: boolean) => {
        setSelectedNoticeIds(selected ? notices.map((notice) => notice.noticeId) : []);
    };

    const toggleNotice = (noticeId: number, selected: boolean) => {
        setSelectedNoticeIds((current) => selected
            ? [...current, noticeId]
            : current.filter((id) => id !== noticeId));
    };

    const deleteSelectedNotices = () => {
        startDeleteTransition(async () => {
            // 선택 개수에 따른 단건/일괄 삭제 분기는 서버 액션에서 처리한다.
            const result = await deleteNoticeAction(
                selectedNoticeIds.map(String),
            );

            if (!result.success) {
                toast.error(result.message ?? "공지사항 삭제에 실패했습니다.");
                return;
            }

            toast.success(
                selectedCount === 1
                    ? "공지사항이 삭제되었습니다."
                    : "선택한 공지사항이 삭제되었습니다.",
            );
            setSelectedNoticeIds([]);
            router.refresh();
        });
    };

    const handleConfirmPin = () => {
        if (!pinTarget || isPinning) {
            return;
        }

        startPinTransition(async () => {
            const shouldPin = !pinTarget.isPinned;
            const result = await updateNoticePinAction(
                String(pinTarget.noticeId),
                shouldPin,
            );

            if (!result.success) {
                toast.error(result.message ?? "공지사항 고정 상태 변경에 실패했습니다.");
                return;
            }

            toast.success(
                shouldPin
                    ? "공지사항을 고정했습니다."
                    : "공지사항 고정을 해제했습니다.",
            );
            setPinTarget(null);
            router.refresh();
        });
    };

    const handleClickPin = (notice: Notice) => {
        // 고정 API 연결 전까지 프론트에서 1개 고정 정책만 먼저 막아둔다.
        if (
            !notice.isPinned &&
            pinnedNotice !== undefined &&
            pinnedNotice.noticeId !== notice.noticeId
        ) {
            toast.info("이미 고정되어 있는 공지사항이 존재합니다.");
            return;
        }

        setPinTarget(notice);
    };

    const pinModalTitle = pinTarget?.isPinned
        ? "공지 고정을 해제할까요?"
        : "공지사항을 고정할까요?";

    const pinModalDescription = pinTarget?.isPinned
        ? "고정을 해제하면 해당 공지는 더 이상 상단 고정으로 표시되지 않습니다."
        : "고정 공지는 1개만 설정할 수 있으며, 관리자 공지 목록에서 강조 표시됩니다.";

    const getPinLabel = (notice: Notice) => {
        if (notice.isPinned) {
            return `${notice.title} 고정 해제`;
        }

        return `${notice.title} 고정`;
    };

    const formatAdminDateTime = (dateTime: string) => {
        // 관리자 공통 정책에 맞춰 T를 떼고 분 단위까지만 표시한다.
        return dateTime.replace("T", " ").slice(0, 16);
    };

    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={(event) => toggleAll(event.target.checked)}
                        className="size-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200"
                    />
                    전체 선택
                </label>

                <DeleteModal
                    trigger={(
                        <Button
                            type="button"
                            variant="outline"
                            disabled={selectedCount === 0 || isDeleting}
                            className="h-9 rounded-md border-rose-200 bg-white px-3 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                        >
                            <Trash2 className="size-4" />
                            {isDeleting ? "삭제중..." : "선택 삭제"}
                        </Button>
                    )}
                    title={selectedTitle}
                    description="삭제한 공지사항은 되돌릴 수 없습니다."
                    onDelete={deleteSelectedNotices}
                />
            </div>

            <div className="hidden border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500 sm:grid sm:grid-cols-[32px_minmax(0,1fr)_120px_72px]">
                <span aria-hidden />
                <span>제목</span>
                <span>등록일</span>
                <span className="text-center">고정</span>
            </div>

            {notices.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm font-bold text-slate-400">
                    조회할 공지사항이 없습니다.
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {notices.map((notice) => (
                        <article
                            key={notice.noticeId}
                            className={`grid grid-cols-[32px_minmax(0,1fr)] items-center gap-y-1 px-5 py-4 text-sm sm:grid-cols-[32px_minmax(0,1fr)_120px_72px] sm:gap-y-0 ${notice.isPinned ? "bg-indigo-50 hover:bg-indigo-100" : "hover:bg-slate-50"} cursor-pointer`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedNoticeIds.includes(notice.noticeId)}
                                onChange={(event) => toggleNotice(notice.noticeId, event.target.checked)}
                                aria-label={`${notice.title} 선택`}
                                className="size-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200"
                            />

                            <Link
                                href={`/admin/notices/${notice.noticeId}`}
                                className="truncate font-bold text-slate-700 hover:text-indigo-600"
                            >
                                {notice.title}
                            </Link>

                            <time className="text-slate-500">
                                {formatAdminDateTime(notice.createdAt)}
                            </time>

                            <button
                                type="button"
                                onClick={() => handleClickPin(notice)}
                                disabled={isPinning}
                                aria-label={getPinLabel(notice)}
                                title={getPinLabel(notice)}
                                className="mx-auto flex size-8 cursor-pointer items-center justify-center rounded-full text-slate-300 transition hover:bg-indigo-50 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Pin
                                    className={`size-4 ${notice.isPinned
                                        ? "fill-indigo-500 text-indigo-500"
                                        : ""
                                        }`}
                                />
                            </button>
                        </article>
                    ))}
                </div>
            )}

            <TwoButtonModal
                open={pinTarget !== null}
                onOpenChange={(open) => !open && setPinTarget(null)}
                title={pinModalTitle}
                description={pinModalDescription}
                onConfirm={handleConfirmPin}
            />
        </section>
    );
}
