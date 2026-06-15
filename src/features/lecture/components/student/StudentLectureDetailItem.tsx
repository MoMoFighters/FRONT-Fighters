import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import EnrollLectureBtn from "@/features/lecture/components/buttons/EnrollLectureBtn";
import {
    CategoryUrl,
    LectureDetail,
    LectureProgress,
} from "@/features/lecture/type";

interface StudentLectureDetailItemProps {
    lecture: LectureDetail;
    category: CategoryUrl;
    categoryLabel: string;
    buildingImage: StaticImageData;
    progressData?: LectureProgress;
    firstChapterId?: number;
}

export default function StudentLectureDetailItem({
    lecture,
    category,
    categoryLabel,
    buildingImage,
    progressData,
    firstChapterId,
}: StudentLectureDetailItemProps) {
    const progress = progressData?.totalProgress ?? 0;
    const chapterCount = lecture.chapters.length;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
                <div className="relative h-56 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                        src={lecture.thumbnailUrl || buildingImage}
                        alt={lecture.title}
                        fill
                        sizes="320px"
                        className="object-cover"
                    />
                </div>

                <div className="flex min-w-0 flex-col">
                    <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-500">
                        {categoryLabel} 媛뺤쓽
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                        {lecture.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                        {lecture.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4 text-sm font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 text-slate-700">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            {lecture.averageRating ?? 0}
                            <span className="font-medium text-slate-400">
                                / 5.0
                            </span>
                        </span>

                        <span>珥?{chapterCount}媛?梨뺥꽣</span>

                        <span>
                            {lecture.isEnrolled ? "학습 중" : "수강 전"}
                        </span>
                    </div>

                    <div className="mt-auto border-t border-slate-100 pt-5">
                        {lecture.isEnrolled ? (
                            <div className="flex items-center gap-5">
                                <span className="text-sm font-bold text-indigo-500">
                                    ?숈뒿 以?
                                </span>

                                <Progress value={progress} className="max-w-48" />

                                <span className="text-sm font-semibold text-slate-500">
                                    吏꾨룄??{progress}%
                                </span>

                                {firstChapterId && (
                                    <Link
                                        href={`/student/${category}/lectures/${lecture.lectureId}/chapters/${firstChapterId}`}
                                        className="ml-auto flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                                    >
                                        <Play className="h-4 w-4 fill-white" />
                                        ?댁뼱蹂닿린
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <EnrollLectureBtn
                                    lectureId={lecture.lectureId}
                                    className="h-11 rounded-xl bg-indigo-500 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
