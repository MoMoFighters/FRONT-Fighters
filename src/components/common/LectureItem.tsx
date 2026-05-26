import Link from "next/link";

import { Lecture } from "@/app/admin/lectures/page";
import { Star } from "lucide-react";

import UpdateLectureStatusBtn from "@/features/lecture/admin/buttons/UpdateLectureStatusBtn";
import DeleteLectureBtn from "@/features/lecture/buttons/DeleteLectureBtn";

interface LectureItemProps {
    lecture: Lecture;
    role: string;
    mode: string;
}

export default function LectureItem({
    lecture,
    role,
    mode
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

    if (mode !== 'list') return null;

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
                href={`/${role}/lectures/${lecture.id}`}
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
                        className="
                            flex items-center gap-2
                            text-slate-600
                            shrink-0
                            pr-40
                        "
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