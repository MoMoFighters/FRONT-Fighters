import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Lecture } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";
import AdminLectureApprovalActions from "./AdminLectureApprovalActions";

interface AdminLectureItemProps {
    lecture: Lecture;
}

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

export default function AdminLectureItem({
    lecture,
}: AdminLectureItemProps) {
    const categoryMeta = getCategoryMeta(lecture.category);
    const chapterCount =
        lecture.chapterCount ??
        lecture.totalChapterCount ??
        lecture.chapters?.length ??
        0;
    const statusLabel = {
        ACTIVE: "운영 중",
        WAITING: "승인 대기",
        HOLD: "운영 보류",
        DELETE: "삭제됨",
    }[lecture.lectureStatus];

    return (
        <article className="relative flex items-center gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50">
            <Link
                href={`/admin/lectures/${lecture.lectureId}`}
                className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-slate-100"
            >
                {lecture.thumbnailUrl && (
                    <Image
                        src={lecture.thumbnailUrl}
                        alt={lecture.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                    />
                )}
            </Link>

            <div className="min-w-0 flex-1 py-1">
                <Link
                    href={`/admin/lectures/${lecture.lectureId}`}
                    className="block min-w-0"
                >
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-500">
                        {categoryMeta.label}
                    </span>
                    <h2 className="mt-2 truncate text-base font-bold text-slate-700">
                        {lecture.title}
                    </h2>
                    <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-400">
                        {lecture.description}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                        총 {chapterCount}개 챕터 · {formatAdminDateTime(lecture.createdAt)}
                    </p>
                </Link>
            </div>

            <div className="flex w-32 shrink-0 flex-col items-end gap-3 self-stretch py-1">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {lecture.averageRating ?? 0}
                    <span className="font-medium text-slate-400">/ 5.0</span>
                    <span className="text-slate-400">({lecture.reviewCount})</span>
                </div>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
                    {statusLabel}
                </span>
                {lecture.lectureStatus === "WAITING" && (
                    <div className="mt-auto">
                        <AdminLectureApprovalActions lectureIds={[lecture.lectureId]} />
                    </div>
                )}
                {lecture.lectureStatus !== "WAITING" && (
                    <div className="mt-auto">
                        <AdminLectureDeleteButton
                            target="강의"
                            targetId={lecture.lectureId}
                        />
                    </div>
                )}
            </div>
        </article>
    );
}
