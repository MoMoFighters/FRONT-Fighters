import Link from "next/link";

import { Edit, Star } from "lucide-react";

import UpdateLectureStatusBtn from "@/features/lecture/components/buttons/UpdateLectureStatusBtn";
import DeleteLectureBtn from "@/features/lecture/components/buttons/DeleteLectureBtn";
import EnrollLectureBtn from "@/features/lecture/components/buttons/EnrollLectureBtn";
import AcceptLectureBtn from "@/features/lecture/components/buttons/AcceptLectureBtn";
import RejectLectureBtn from "@/features/lecture/components/buttons/RejectLectureBtn";
import { Button } from "../ui/button";
import { Lecture, LectureProgress } from "@/features/lecture/type";
import { Progress } from "../ui/progress";

interface LectureItemProps {
    lecture: Lecture;
    role: string;
    mode: string;
    href?: string;
    progressData?: LectureProgress
}

export default function LectureItem({
    lecture,
    role,
    mode,
    href,
    progressData
}: LectureItemProps) {

    const categoryColors: Record<string, string> = {
        FITNESS: 'bg-cyan-200',
        BEAUTY: 'bg-fuchsia-200',
        COOK: 'bg-orange-200',
        STUDY: 'bg-emerald-200',
        ART: 'bg-violet-200',
    };

    const categoryMap: Record<string, string> = {
        STUDY: '학습',
        ART: '예술',
        COOK: '요리',
        FITNESS: '운동',
        BEAUTY: '뷰티',
    };

    if (mode === "teacherList" && href) {
        return (
            <div
                className="bg-white rounded-xl p-4 border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all cursor-pointer relative"
            >
                <Link href={href}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-16 h-12 border border-slate-50 rounded-lg shrink-0 bg-center bg-cover"
                            style={{
                                backgroundImage: lecture.thumbnailUrl
                                    ? `url(${lecture.thumbnailUrl})`
                                    : 'none'
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-[12px] mb-1 truncate">{lecture.title}</h4>
                            {lecture.lectureStatus === "ACTIVE" && <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {lecture.averageRating}
                                </span>
                            </div>}
                            {lecture.lectureStatus === "WAITING" && <p className="text-xs text-amber-600 font-medium">관리자 승인 대기중입니다</p>}
                            {lecture.lectureStatus === "HOLD" && <div className="flex items-center gap-2">
                                <p className="text-xs text-red-600 font-medium">승인 거절됨</p>
                            </div>}
                        </div>
                    </div>
                </Link>
                {lecture.lectureStatus === "HOLD" && (<button className="ml-auto absolute bottom-3 right-3">
                    <Link href={`/teacher/lectures/${lecture.id}/edit`}>
                        <Edit className="w-3 h-3 text-red-500 hover:text-red-700" />
                    </Link>
                </button>)}
            </div>
        )
    }

    if (mode === 'detail') {
        return (
            <div className="bg-white border rounded-lg border-slate-200 p-6 relative">
                <div className="grid grid-cols-[400px_1fr] gap-8">
                    <div
                        className="rounded-2xl border border-slate-50 max-w-100 h-56.25 bg-center bg-cover"
                        style={{
                            backgroundImage: lecture.thumbnailUrl
                                ? `url(${lecture.thumbnailUrl})`
                                : 'none'
                        }}
                    />

                    {/* Info */}
                    <div className="space-y-2">
                        {/* Category Badge */}
                        <div className="flex items-center">
                            <span className={`${categoryColors[lecture.category]} px-3 py-1 rounded-full text-xs font-bold text-slate-600`}>
                                {categoryMap[lecture.category]}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-slate-900">{lecture.title}</h1>

                        {/* Description */}
                        <p className="text-md text-slate-500 leading-relaxed mb-25">{lecture.description}</p>

                        {/* Rating */}
                        {lecture.lectureStatus === 'ACTIVE' && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="font-bold">평점 :</span>
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="font-bold">{lecture.averageRating}</span>
                                <span className="text-slate-400">/ 5.0 점</span>
                            </div>
                        )}
                    </div>
                </div>

                {role === "student" && lecture.isEnrolled &&
                    <div className="absolute w-120 bottom-7 right-6 flex gap-3 items-center text-sm text-slate-400">
                        <Progress value={progressData?.totalProgress} className="flex-1" /> {progressData?.completedCount} / {progressData?.totalChapterCount}
                    </div>
                }

                {role === 'admin' && lecture.lectureStatus === 'ACTIVE' && <DeleteLectureBtn mode="text" id={lecture.id} />}

                {role === 'admin' && lecture.lectureStatus === 'WAITING' && (
                    <div className="flex gap-4 absolute bottom-6 right-6">
                        <AcceptLectureBtn id={lecture.id} />
                        <RejectLectureBtn id={lecture.id} />
                    </div>
                )}

                {role === "student" && !lecture.isEnrolled && <EnrollLectureBtn lectureId={lecture.id} />}

                {role === "teacher" && lecture.lectureStatus !== "WAITING" && (
                    <div>
                        <Link href={`/teacher/lectures/${lecture.id}/edit`}>
                            <Button
                                className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-semibold text-md py-6 px-6 rounded-md! absolute bottom-6 right-36"
                            >
                                수정하기
                            </Button>
                        </Link>
                        <DeleteLectureBtn mode="text" id={lecture.id} />
                    </div>
                )}
            </div>
        )
    }

    if (mode === 'list' && href) {

        return (
            <div
                className="
                relative
                bg-white rounded-xl mb-2.5
                border border-slate-200
                transition-all
                hover:shadow-md
                hover:-translate-y-0.5
            "
            >

                <Link
                    href={href}
                    className="block p-4"
                >

                    <div className="flex items-center gap-4 min-w-0">

                        <div
                            className="
                            w-24 h-16 rounded-lg border border-slate-50
                            bg-center bg-cover shrink-0"
                            style={{
                                backgroundImage: lecture.thumbnailUrl
                                    ? `url(${lecture.thumbnailUrl})`
                                    : 'none'
                            }}
                        />

                        <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-3 mb-1 min-w-0">

                                <span
                                    className={`
                                    ${categoryColors[lecture.category]}
                                    px-3 py-1 rounded-full
                                    text-xs font-bold text-slate-600
                                    shrink-0
                                `}
                                >
                                    {categoryMap[lecture.category]}
                                </span>

                                <h3
                                    className="
                                    text-lg font-bold
                                    text-slate-900
                                    truncate
                                    max-w-60
                                "
                                >
                                    {lecture.title}
                                </h3>
                            </div>

                            <p
                                className="
                                text-sm text-slate-500
                                truncate
                                max-w-120
                            "
                            >
                                {lecture.description}
                            </p>
                        </div>

                        <div
                            className={`
                            flex items-center gap-2
                            text-slate-600
                            shrink-0
                            ${role === 'student' ? 'pr-4' : 'pr-40'}
                        `}
                        >

                            <Star
                                className="
                                w-5 h-5
                                fill-amber-400
                                text-amber-400
                            "
                            />

                            <span className="font-bold">
                                {lecture.averageRating}
                            </span>

                            <span className="text-slate-400">
                                / 5.0
                            </span>
                        </div>
                    </div>
                </Link>

                {role === 'admin' && (
                    <>
                        <div className="absolute top-8 right-14 z-10">
                            <UpdateLectureStatusBtn
                                id={lecture.id}
                                status={lecture.lectureStatus}
                            />
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                            <DeleteLectureBtn
                                mode="icon"
                                id={lecture.id}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return null;
}