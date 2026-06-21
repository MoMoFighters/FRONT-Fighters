"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DeleteModal from "@/features/modal/DeleteModal";
import { AdminNotice } from "@/features/notice/type";

interface AdminNoticeListProps {
    notices: AdminNotice[];
}

export default function AdminNoticeList({ notices: initialNotices }: AdminNoticeListProps) {
    const [notices, setNotices] = useState(initialNotices);
    const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]);
    const isAllSelected = notices.length > 0 && selectedNoticeIds.length === notices.length;
    const selectedCount = selectedNoticeIds.length;

    const selectedTitle = useMemo(
        () => selectedCount > 0 ? `${selectedCount}개 공지사항을 삭제하시겠습니까?` : "공지사항을 선택해주세요.",
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
        // TODO: 공지사항 일괄 삭제 API가 준비되면 selectedNoticeIds를 전달한다.
        setNotices((current) => current.filter(
            (notice) => !selectedNoticeIds.includes(notice.noticeId),
        ));
        setSelectedNoticeIds([]);
        toast.success("선택한 공지사항을 삭제했습니다.");
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
                            disabled={selectedCount === 0}
                            className="h-9 rounded-md border-rose-200 bg-white px-3 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                        >
                            <Trash2 className="size-4" />
                            선택 삭제
                        </Button>
                    )}
                    title={selectedTitle}
                    description="삭제한 공지사항은 되돌릴 수 없습니다."
                    onDelete={deleteSelectedNotices}
                />
            </div>

            <div className="grid grid-cols-[32px_80px_minmax(0,1fr)_120px_80px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500">
                <span aria-hidden />
                <span>번호</span>
                <span>제목</span>
                <span>등록일</span>
                <span className="text-right">조회수</span>
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
                            className="grid grid-cols-[32px_80px_minmax(0,1fr)_120px_80px] items-center px-5 py-4 text-sm hover:bg-slate-50"
                        >
                            <input
                                type="checkbox"
                                checked={selectedNoticeIds.includes(notice.noticeId)}
                                onChange={(event) => toggleNotice(notice.noticeId, event.target.checked)}
                                aria-label={`${notice.title} 선택`}
                                className="size-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200"
                            />
                            <span className="font-medium text-slate-500">{notice.noticeId}</span>
                            <p className="truncate font-semibold text-slate-700">{notice.title}</p>
                            <time className="text-slate-500">{notice.createdAt}</time>
                            <span className="text-right font-medium text-slate-500">{notice.viewCount.toLocaleString()}</span>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
