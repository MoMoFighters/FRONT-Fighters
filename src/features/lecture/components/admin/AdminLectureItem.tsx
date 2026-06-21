import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Lecture } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import AdminLectureApprovalActions from "./AdminLectureApprovalActions";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";

interface AdminLectureItemProps {
    lecture: Lecture;
    selectable?: boolean;
    selected?: boolean;
    onSelectedChange?: (lectureId: number, selected: boolean) => void;
}

export default function AdminLectureItem({
    lecture,
    selectable = false,
    selected = false,
    onSelectedChange,
}: AdminLectureItemProps) {
    const categoryMeta = getCategoryMeta(lecture.category);
    const statusLabel = {
        ACTIVE: "운영 중",
        WAITING: "승인 대기",
        HOLD: "운영 보류",
        DELETE: "삭제됨",
    }[lecture.lectureStatus];
    const isWaiting = lecture.lectureStatus === "WAITING";
    const gridColumns = selectable
        ? isWaiting
            ? "grid-cols-[24px_184px_minmax(0,1fr)_180px]"
            : "grid-cols-[24px_184px_minmax(0,1fr)_150px_36px]"
        : isWaiting
            ? "grid-cols-[184px_minmax(0,1fr)_180px]"
            : "grid-cols-[184px_minmax(0,1fr)_150px_36px]";

    return (
        <article className={`grid items-center gap-6 border-b border-slate-100 p-4 last:border-b-0 hover:bg-slate-50 ${gridColumns}`}>
            {selectable && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => onSelectedChange?.(lecture.lectureId, event.target.checked)}
                    aria-label={`${lecture.title} 선택`}
                    className="size-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200"
                />
            )}
            <Link
                href={`/admin/lectures/${lecture.lectureId}`}
                className="relative h-28 overflow-hidden rounded-xl bg-slate-100"
            >
                {lecture.thumbnailUrl && (
                    <Image
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        fill
                        sizes="184px"
                        className="object-cover"
                    />
                )}
            </Link>

            <Link
                href={`/admin/lectures/${lecture.lectureId}`}
                className="min-w-0 self-stretch py-1"
            >
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-500">
                    {categoryMeta.label}
                </span>
                <h2 className="mt-3 truncate text-lg font-bold text-slate-700">
                    {lecture.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-slate-400">
                    {lecture.description}
                </p>
                <p className="mt-3 text-xs font-semibold text-slate-400">
                    총 {lecture.chapterCount}개 챕터 · {lecture.createdAt}
                </p>
            </Link>

            <div className="flex h-full flex-col items-end justify-between py-1">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {lecture.averageRating ?? 0}
                    <span className="font-medium text-slate-400">/ 5.0</span>
                    <span className="text-slate-400">({lecture.reviewCount})</span>
                </div>
                {isWaiting ? (
                    <AdminLectureApprovalActions lectureIds={[lecture.lectureId]} />
                ) : (
                    <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
                        {statusLabel}
                    </span>
                )}
            </div>

            {!isWaiting && (
                <div className="self-end pb-1">
                    <AdminLectureDeleteButton target="강의" targetId={lecture.lectureId} />
                </div>
            )}
        </article>
    );
}
