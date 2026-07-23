import Image from "next/image";
import { Star } from "lucide-react";

import { LectureDetailResponse } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";
import AdminLectureApprovalActions from "./AdminLectureApprovalActions";

interface AdminLectureDetailHeroProps {
    lecture: LectureDetailResponse;
    reviewCount: number;
}

const formatAdminDateTime = (dateTime: string) => {
    return dateTime.replace("T", " ").slice(0, 16);
};

export default function AdminLectureDetailHero({
    lecture,
    reviewCount,
}: AdminLectureDetailHeroProps) {
    const categoryMeta = getCategoryMeta(lecture.category);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm [container-type:inline-size]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
                    {lecture.thumbnailUrl && (
                        <Image
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            priority
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="flex min-w-0 flex-col">
                    <span className="w-fit rounded-full bg-indigo-50 px-[clamp(0.5rem,2cqw,0.75rem)] py-1 text-[clamp(0.75rem,2.5cqw,0.875rem)] font-bold text-indigo-500">
                        {categoryMeta.label} 강의
                    </span>
                    <h2 className="mt-4 text-[clamp(1.25rem,5cqw,1.875rem)] font-bold tracking-tight text-slate-950">
                        {lecture.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-[clamp(0.75rem,2.2cqw,0.875rem)] font-medium leading-6 text-slate-500">
                        {lecture.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-[clamp(0.75rem,2.2cqw,0.875rem)] font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-700">
                            <Star className="size-4 fill-amber-400 text-amber-400" />
                            {lecture.averageRating ?? 0}
                            <span className="font-medium text-slate-400">/ 5.0</span>
                        </span>
                        <span>총 {lecture.chapters.length}개 챕터</span>
                        <span>수강평 {reviewCount}개</span>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
                        <span className="text-[clamp(0.75rem,2.2cqw,0.875rem)] font-bold text-slate-400">
                            등록일 {formatAdminDateTime(lecture.createdAt)}
                        </span>
                        {lecture.lectureStatus === "WAITING" ? (
                            <AdminLectureApprovalActions lectureIds={[lecture.lectureId]} />
                        ) : (
                            <AdminLectureDeleteButton
                                target="강의"
                                targetId={lecture.lectureId}
                                variant="text"
                                successHref="/admin/lectures"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
