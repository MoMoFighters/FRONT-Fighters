import { Lecture } from "@/app/admin/lectures/page";
import { Star, Trash2 } from "lucide-react";
import UpdateLectureStatusBtn from "@/features/lecture/admin/buttons/UpdateLectureStatusBtn";
import DeleteLectureBtn from "@/features/lecture/buttons/DeleteLectureBtn";

interface LectureItemProps {
    lecture: Lecture;
    role: string;
    mode: string;
}

export default function LectureItem({ lecture, role, mode }: LectureItemProps) {

    const categoryColors: Record<string, string> = {
        'health': 'bg-cyan-200',
        'beauty': 'bg-fuchsia-200',
        'cook': 'bg-orange-200',
        'study': 'bg-emerald-200',
        'art': 'bg-violet-200',
    };

    let categoryForUser: string;

    switch (lecture.category) {
        case 'study':
            categoryForUser = '학습';
            break;

        case 'art':
            categoryForUser = '예술';
            break;

        case 'cook':
            categoryForUser = '요리';
            break;

        case 'health':
            categoryForUser = '운동';
            break;

        case 'beauty':
            categoryForUser = '뷰티';
            break;

        default:
            categoryForUser = '';
    }

    return (
        <div>
            {mode === "list" && (
                <div
                    className="bg-white rounded-xl mb-2.5 p-4 hover:shadow-md hover:-translate-y-1 transition-all border border-slate-200 relative group cursor-pointer"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <div
                            className="w-24 h-16 rounded-lg bg-slate-300 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 min-w-0">
                                <span className={`${categoryColors[lecture.category]} px-3 py-1 rounded-full text-xs font-bold text-slate-600`}>
                                    {categoryForUser}
                                </span>
                                <h3 className="max-w-100 text-lg font-bold text-slate-900 truncate">{lecture.title}</h3>
                            </div>

                            <p className="max-w-125 text-sm text-slate-500 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">{lecture.description}</p>
                        </div>

                        <div className="flex items-center gap-6 shrink-0 mr-12">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="font-bold">{lecture.rating.toFixed(1)}</span>
                                <span className="text-slate-400">/ 5.0</span>
                            </div>

                            {role === 'admin' && <UpdateLectureStatusBtn status={lecture.status} />}
                        </div>
                        <DeleteLectureBtn mode='icon' />
                    </div>
                </div>
            )}
        </div>
    );
}