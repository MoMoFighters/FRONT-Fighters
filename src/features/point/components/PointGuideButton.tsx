"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, CircleQuestionMark } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface PointGuideEntry {
    label: string;
    amount: number;
    type: "GAINED" | "USED";
    note?: string;
}

const POINT_GUIDE_ENTRIES: PointGuideEntry[] = [
    {
        label: "챕터 1개 수강",
        amount: 10,
        type: "GAINED",
        // note: "강의당 평균 5챕터 → 강의 완료 시 약 50P",
    },
    {
        label: "강의평 작성",
        amount: 30,
        type: "GAINED",
    },
    {
        label: "새로운 친구 추가",
        amount: 3,
        type: "GAINED",
    },
    {
        label: "방명록 작성",
        amount: 10,
        type: "GAINED",
    },
    {
        label: "친구 도시 방문 (버스비)",
        amount: 1,
        type: "USED",
    },
    {
        label: "운세 보기",
        amount: 5,
        type: "USED",
    },
];

export default function PointGuideButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="포인트 적립/차감 안내"
                className="inline-flex cursor-pointer items-center justify-center text-slate-400 transition hover:text-indigo-500"
            >
                <CircleQuestionMark className="h-4 w-4" />
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>포인트 안내</DialogTitle>
                        <DialogDescription>
                            포인트는 아래 기준으로 적립되거나 차감됩니다.
                        </DialogDescription>
                    </DialogHeader>

                    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60">
                        {POINT_GUIDE_ENTRIES.map((entry) => {
                            const isIncrease = entry.type === "GAINED";

                            return (
                                <li
                                    key={entry.label}
                                    className="flex items-center gap-3 px-4 py-3"
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isIncrease
                                            ? "bg-indigo-50 text-indigo-500"
                                            : "bg-rose-50 text-rose-500"
                                            }`}
                                    >
                                        {isIncrease ? (
                                            <ArrowDownLeft className="h-4 w-4" />
                                        ) : (
                                            <ArrowUpRight className="h-4 w-4" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-slate-900">
                                            {entry.label}
                                        </p>
                                        {entry.note && (
                                            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                                                {entry.note}
                                            </p>
                                        )}
                                    </div>

                                    <p
                                        className={`shrink-0 text-sm font-black ${isIncrease ? "text-indigo-500" : "text-rose-500"
                                            }`}
                                    >
                                        {isIncrease ? "+" : "-"}
                                        {entry.amount.toLocaleString()} P
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </DialogContent>
            </Dialog>
        </>
    );
}
