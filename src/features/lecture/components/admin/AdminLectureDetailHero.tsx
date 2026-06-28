import Image from "next/image";
import { Star } from "lucide-react";

import { LectureDetailResponse } from "@/features/lecture/type";
import getCategoryMeta from "@/features/lecture/components/student/shared/category";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";

interface AdminLectureDetailHeroProps {
    lecture: LectureDetailResponse;
    reviewCount: number;
}

export default function AdminLectureDetailHero({
    lecture,
    reviewCount,
}: AdminLectureDetailHeroProps) {
    const categoryMeta = getCategoryMeta(lecture.category);

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
                <div className="relative h-56 overflow-hidden rounded-xl bg-slate-100">
                    {lecture.thumbnailUrl && (
                        <Image
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            fill
                            sizes="320px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="flex min-w-0 flex-col">
                    <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-500">
                        {categoryMeta.label} 강의
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                        {lecture.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                        {lecture.description}
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-700">
                            <Star className="size-4 fill-amber-400 text-amber-400" />
                            {lecture.averageRating ?? 0}
                            <span className="font-medium text-slate-400">/ 5.0</span>
                        </span>
                        <span>총 {lecture.chapters.length}개 챕터</span>
                        <span>수강평 {reviewCount}개</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-semibold text-slate-400">
                            등록일 {lecture.createdAt}
                        </span>
                        <AdminLectureDeleteButton
                            target="강의"
                            targetId={lecture.lectureId}
                            variant="text"
                            successHref="/admin/lectures"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
