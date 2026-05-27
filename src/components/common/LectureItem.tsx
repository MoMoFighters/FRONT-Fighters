import Link from "next/link";

import { Lecture } from "@/app/admin/lectures/page";
import { Edit, Star } from "lucide-react";

import UpdateLectureStatusBtn from "@/features/lecture/admin/buttons/UpdateLectureStatusBtn";
import DeleteLectureBtn from "@/features/lecture/buttons/DeleteLectureBtn";
import EnrollLectureBtn from "@/features/lecture/buttons/EnrollLectureBtn";
import AcceptLectureBtn from "@/features/lecture/buttons/AcceptLectureBtn";
import RejectLectureBtn from "@/features/lecture/buttons/RejectLectureBtn";

interface LectureItemProps {
    lecture: Lecture;
    role?: string;
    mode: string;
    href?: string;
    isEnrolled?: boolean;
}

export default function LectureItem({
    lecture,
    role,
    mode,
    href,
    isEnrolled
}: LectureItemProps) {

    const categoryColors: Record<string, string> = {
        health: 'bg-cyan-200',
        beauty: 'bg-fuchsia-200',
        cook: 'bg-orange-200',
        study: 'bg-emerald-200',
        art: 'bg-violet-200',
    };

    const categoryMap: Record<string, string> = {
        study: '학습',
        art: '예술',
        cook: '요리',
        health: '운동',
        beauty: '뷰티',
    };

    if (mode === "teacherList" && href) {
        return (
            <div
                className="bg-white rounded-xl p-4 border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all cursor-pointer"
            >
                <Link href={href}>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-16 h-12 bg-slate-300 rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-[12px] mb-1 truncate">{lecture.title}</h4>
                            {lecture.status === "active" && <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {lecture.rating.toFixed(1)}
                                </span>
                                <span>수강생 {lecture.studentCount}명</span>
                            </div>}
                            {lecture.status === "waiting" && <p className="text-xs text-amber-600 font-medium">관리자 승인 대기중입니다</p>}
                            {lecture.status === "hold" && <div className="flex items-center gap-2">
                                <p className="text-xs text-red-600 font-medium">승인 거절됨</p>
                                <button className="ml-auto">
                                    <Edit className="w-3 h-3 text-red-500 hover:text-red-700" />
                                </button>
                            </div>}
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    if (mode === 'detail') {
        return (
            <div className="bg-white border rounded-lg border-slate-200 p-6 relative">
                <div className="grid grid-cols-[400px_1fr] gap-8">
                    <div
                        className="rounded-2xl max-w-100 h-56.25 bg-slate-200"
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
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-bold">평점 :</span>
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold">{lecture.rating.toFixed(1)}</span>
                            <span className="text-slate-400">/ 5.0 점</span>
                        </div>
                    </div>
                </div>
                {role === 'admin' && lecture.status === 'active' && <DeleteLectureBtn mode="text" id={lecture.id} />}

                {role === 'admin' && lecture.status === 'waiting' && (
                    <div className="flex gap-4 absolute bottom-6 right-6">
                        <AcceptLectureBtn />
                        <RejectLectureBtn />
                    </div>
                )}

                {role === "student" && !isEnrolled && <EnrollLectureBtn />}
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
                            w-24 h-16 rounded-lg
                            bg-slate-300 shrink-0
                        "
                        />

                        <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-3 mb-2 min-w-0">

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
                                {lecture.rating.toFixed(1)}
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
                                status={lecture.status}
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