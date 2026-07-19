import { Lecture } from "@/features/lecture/type";
import GuestLectureListItem from "./GuestLectureListItem";

interface GuestLectureListProps {
    lectures: Lecture[];
}

export default function GuestLectureList({
    lectures,
}: GuestLectureListProps) {
    return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            {lectures.map((lecture, index) => (
                <GuestLectureListItem
                    key={lecture.lectureId}
                    lecture={lecture}
                    priority={index === 0}
                />
            ))}
        </div>
    );
}
