"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface LectureEditChapterItemProps {
    orderNo: number;
    title: string;
    thumbnailUrl?: string;
    onTitleChange: (title: string) => void;
}

export default function LectureEditChapterItem({
    orderNo,
    title,
    thumbnailUrl,
    onTitleChange,
}: LectureEditChapterItemProps) {
    return (
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={`챕터 ${orderNo} 썸네일`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <PlayCircle className="size-6 text-indigo-400" />
                )}
            </div>

            <div className="flex-1">
                <p className="mb-2 text-sm font-black text-slate-700">
                    챕터 {orderNo}
                </p>
                <input
                    type="text"
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="챕터 제목을 입력하세요"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none placeholder:text-slate-400 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
            </div>
        </div>
    );
}
