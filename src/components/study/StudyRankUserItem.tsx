import Image from "next/image";

import { formatStudyTime } from "@/features/study/utils";
import type { StudyRankingEntry } from "@/features/study/type";

interface StudyRankUserItemProps {
    entry: StudyRankingEntry;
    variant: "podium" | "list";
}

const PODIUM_STYLE: Record<number, { height: string; bar: string; avatarRing: string }> = {
    1: { height: "h-20", bar: "bg-amber-400", avatarRing: "ring-amber-300" },
    2: { height: "h-14", bar: "bg-slate-300", avatarRing: "ring-slate-300" },
    3: { height: "h-10", bar: "bg-orange-300", avatarRing: "ring-orange-300" },
};

export default function StudyRankUserItem({ entry, variant }: StudyRankUserItemProps) {
    if (variant === "list") {
        return (
            <div className="flex items-center gap-3 px-1 py-2">
                <span className="w-5 shrink-0 text-center text-xs font-black text-slate-400">
                    {entry.rank}
                </span>

                <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xs font-black text-slate-500">
                    {entry.profileImageUrl ? (
                        <Image
                            src={entry.profileImageUrl}
                            alt={`${entry.nickname} 프로필`}
                            fill
                            sizes="32px"
                            className="object-cover"
                        />
                    ) : (
                        entry.nickname.slice(0, 1)
                    )}
                </div>

                <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">
                    {entry.nickname}
                </p>

                <p className="shrink-0 text-xs font-bold text-slate-400">
                    {formatStudyTime(entry.totalSeconds)}
                </p>
            </div>
        );
    }

    const podiumStyle = PODIUM_STYLE[entry.rank] ?? PODIUM_STYLE[3];

    return (
        <div className="flex flex-col items-center">
            <div
                className={`relative mb-1 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-black text-slate-500 ring-2 ${podiumStyle.avatarRing}`}
            >
                {entry.profileImageUrl ? (
                    <Image
                        src={entry.profileImageUrl}
                        alt={`${entry.nickname} 프로필`}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                ) : (
                    entry.nickname.slice(0, 1)
                )}
            </div>

            <p className="max-w-16 truncate text-xs font-black text-slate-800">
                {entry.nickname}
            </p>
            <p className="text-[10px] font-bold text-slate-400">
                {formatStudyTime(entry.totalSeconds)}
            </p>

            <div
                className={`mt-2 flex w-16 items-start justify-center rounded-t-lg ${podiumStyle.height} ${podiumStyle.bar}`}
            >
                <span className="mt-1.5 text-lg font-black text-white">
                    {entry.rank}
                </span>
            </div>
        </div>
    );
}
