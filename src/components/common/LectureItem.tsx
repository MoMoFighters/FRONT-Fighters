import Image from "next/image";
import Link from "next/link";
import { Edit, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AcceptLectureBtn from "@/features/lecture/components/buttons/AcceptLectureBtn";
import DeleteLectureBtn from "@/features/lecture/components/buttons/DeleteLectureBtn";
import EnrollLectureBtn from "@/features/lecture/components/buttons/EnrollLectureBtn";
import RejectLectureBtn from "@/features/lecture/components/buttons/RejectLectureBtn";
import UpdateLectureStatusBtn from "@/features/lecture/components/buttons/UpdateLectureStatusBtn";
import { Lecture, LectureDetailResponse } from "@/features/lecture/type";

interface LectureItemProps {
    lecture: Lecture | LectureDetailResponse;
    role: string;
    mode: string;
    href?: string;
}

const categoryColors: Record<string, string> = {
    FITNESS: "bg-cyan-200",
    BEAUTY: "bg-fuchsia-200",
    COOK: "bg-orange-200",
    STUDY: "bg-emerald-200",
    ART: "bg-violet-200",
};

const categoryMap: Record<string, string> = {
    STUDY: "학습",
    ART: "예술",
    COOK: "요리",
    FITNESS: "운동",
    BEAUTY: "뷰티",
};

export default function LectureItem({
    lecture,
    role,
    mode,
    href,
}: LectureItemProps) {
    const lectureStatus = lecture.lectureStatus;
    const categoryLabel = categoryMap[lecture.category] ?? lecture.category;
    const categoryColor = categoryColors[lecture.category] ?? "bg-slate-200";
    const averageRating = lecture.averageRating ?? 0;

    if (mode === "teacherList" && href) {
        return (
            <div className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:bg-slate-50 hover:shadow-md">
                <Link href={href}>
                    <div className={`flex items-center gap-3 ${lectureStatus === "HOLD" || lectureStatus === "WAITING"
                            ? "pr-16"
                            : lectureStatus === "ACTIVE"
                                ? "pr-8"
                                : ""
                        }`}>
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-50 bg-slate-100">
                            {lecture.thumbnailUrl && (
                                <Image
                                    src={lecture.thumbnailUrl}
                                    alt={lecture.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h4 className="mb-1 truncate text-[12px] font-bold text-slate-900">
                                {lecture.title}
                            </h4>

                            {lectureStatus === "ACTIVE" && (
                                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        {averageRating} / 5
                                    </span>
                                </div>
                            )}

                            {lectureStatus === "WAITING" && (
                                <p className="text-xs font-medium text-amber-600">
                                    관리자 승인 대기중입니다.
                                </p>
                            )}

                            {lectureStatus === "HOLD" && (
                                <p className="text-xs font-medium text-red-600">
                                    승인 거절됨
                                </p>
                            )}
                        </div>
                    </div>
                </Link>

                {(lectureStatus === "ACTIVE" || lectureStatus === "HOLD" || lectureStatus === "WAITING") && (
                    <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
                        {(lectureStatus === "HOLD" || lectureStatus === "WAITING") && (
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="p-1.5 rounded-lg text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-500"
                            >
                                <Link href={`/teacher/lectures/${lecture.lectureId}/edit`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                        )}

                        <DeleteLectureBtn
                            mode="icon"
                            id={lecture.lectureId}
                            successHref="/teacher/lectures"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (mode === "detail") {
        return (
            <div className="relative rounded-lg border border-slate-200 bg-white p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[400px_1fr] md:gap-8">
                    <div className="relative h-56.25 max-w-100 overflow-hidden rounded-2xl border border-slate-50 bg-slate-100">
                        {lecture.thumbnailUrl && (
                            <Image
                                src={lecture.thumbnailUrl}
                                alt={lecture.title}
                                fill
                                sizes="400px"
                                priority
                                className="object-cover"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className={`${categoryColor} rounded-full px-3 py-1 text-xs font-bold text-slate-600`}>
                                {categoryLabel}
                            </span>
                        </div>

                        <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                            {lecture.title}
                        </h1>

                        <p className="mb-25 text-md leading-relaxed text-slate-500">
                            {lecture.description}
                        </p>

                        {lectureStatus === "ACTIVE" && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="font-bold">평점 :</span>
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-bold">{averageRating}</span>
                                <span className="text-slate-400">/ 5.0 점</span>
                            </div>
                        )}
                    </div>
                </div>

                {role === "student" && lecture.isEnrolled && (
                    <div className="absolute bottom-7 right-6 flex w-120 items-center gap-3 text-sm text-slate-400">
                        <Progress value={lecture.lectureProgress ?? 0} className="flex-1" />
                        {lecture.lectureProgress ?? 0}%
                    </div>
                )}

                {role === "admin" && lectureStatus === "ACTIVE" && (
                    <DeleteLectureBtn mode="text" id={lecture.lectureId} />
                )}

                {role === "admin" && lectureStatus === "WAITING" && (
                    <div className="absolute bottom-6 right-6 flex gap-4">
                        <AcceptLectureBtn id={lecture.lectureId} />
                        <RejectLectureBtn id={lecture.lectureId} />
                    </div>
                )}

                {role === "student" && !lecture.isEnrolled && (
                    <EnrollLectureBtn lectureId={lecture.lectureId} />
                )}

                {role === "teacher" && lectureStatus === "ACTIVE" && (
                    <DeleteLectureBtn
                        mode="text"
                        id={lecture.lectureId}
                        successHref="/teacher/lectures"
                    />
                )}

                {role === "teacher" && (lectureStatus === "HOLD" || lectureStatus === "WAITING") && (
                    <div>
                        <Link href={`/teacher/lectures/${lecture.lectureId}/edit`}>
                            <Button className="absolute bottom-6 right-36 cursor-pointer rounded-md! bg-blue-400 px-6 py-6 text-md font-bold text-white hover:bg-blue-500">
                                수정하기
                            </Button>
                        </Link>
                        <DeleteLectureBtn
                            mode="text"
                            id={lecture.lectureId}
                            successHref="/teacher/lectures"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (mode === "list" && href) {
        return (
            <div className="relative mb-2.5 rounded-xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md">
                <Link href={href} className="block p-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-50 bg-slate-100">
                            {lecture.thumbnailUrl && (
                                <Image
                                    src={lecture.thumbnailUrl}
                                    alt={lecture.title}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex min-w-0 items-center gap-3">
                                <span className={`${categoryColor} shrink-0 rounded-full px-3 py-1 text-xs font-bold text-slate-600`}>
                                    {categoryLabel}
                                </span>

                                <h3 className="max-w-60 truncate text-lg font-bold text-slate-900">
                                    {lecture.title}
                                </h3>
                            </div>

                            <p className="max-w-120 truncate text-sm text-slate-500">
                                {lecture.description}
                            </p>
                        </div>

                        <div className={`flex shrink-0 items-center gap-2 text-slate-600 ${role === "student" ? "pr-4" : "pr-40"}`}>
                            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                            <span className="font-bold">{averageRating}</span>
                            <span className="text-slate-400">/ 5.0</span>
                        </div>
                    </div>
                </Link>

                {role === "admin" && lectureStatus && (
                    <>
                        <div className="absolute right-14 top-8 z-10">
                            <UpdateLectureStatusBtn
                                id={lecture.lectureId}
                                status={lectureStatus}
                            />
                        </div>

                        <div className="absolute right-2 top-2 z-10">
                            <DeleteLectureBtn mode="icon" id={lecture.lectureId} />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return null;
}
