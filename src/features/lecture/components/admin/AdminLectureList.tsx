import { Lecture } from "@/features/lecture/type";
import AdminLectureItem from "./AdminLectureItem";

interface AdminLectureListProps {
    lectures: Lecture[];
}

export default function AdminLectureList({
    lectures,
}: AdminLectureListProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lectures.map((lecture) => (
                <AdminLectureItem
                    key={lecture.lectureId}
                    lecture={lecture}
                />
            ))}
        </section>
    );
}
