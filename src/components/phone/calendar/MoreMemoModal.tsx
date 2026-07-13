import { X } from "lucide-react";

import type { ScheduleItem } from "@/features/calendar/type";

interface MoreMemoModalProps {
    moreDate: string;
    moreMemos: ScheduleItem[];
    onClose: () => void;
    onSelectMemo: (memo: ScheduleItem) => void;
}

export default function MoreMemoModal({
    moreDate,
    moreMemos,
    onClose,
    onSelectMemo,
}: MoreMemoModalProps) {
    return (
        <div
            className="fixed inset-0 z-999999 flex items-center justify-center bg-black/30"
            onClick={onClose}
        >
            <section
                className="w-82 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between border-b border-slate-300 pb-2">
                    <div>
                        <p className="text-xs font-bold text-slate-400">
                            메모 목록
                        </p>
                        <h3 className="text-base font-black text-slate-900">
                            {moreDate}
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="닫기"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex max-h-72 flex-col gap-2 overflow-auto scrollbar-none">
                    {moreMemos.map((memo) => (
                        <button
                            key={memo.calendarId}
                            type="button"
                            onClick={() => onSelectMemo(memo)}
                            className="rounded-md bg-indigo-50 px-3 py-2 text-left transition hover:bg-indigo-100 cursor-pointer"
                        >
                            <p className="truncate text-sm font-black text-slate-800">
                                {memo.title}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-slate-400">
                                {memo.start}
                                {memo.end ? ` ~ ${memo.end}` : ""}
                            </p>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
