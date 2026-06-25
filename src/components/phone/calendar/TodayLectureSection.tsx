import { TodayChapter } from "@/features/calendar/type";
import TodayLectureItem from "@/features/phone/components/todo/TodayLectureItem";

interface TodayLectureSectionProps {
    todayLectures: TodayChapter[];
}

export default function TodayLectureSection({
    todayLectures,
}: TodayLectureSectionProps) {
    return (
        <div className='p-4 flex flex-col gap-3 h-49'>
            <h2 className="text-xl text-slate-900 text-center font-bold">
                수강 이력
            </h2>

            <div className='grid grid-cols-1 gap-2 h-full scrollbar-none overflow-auto pt-0.5'>
                {todayLectures.length > 0 ? (
                    todayLectures.map((lecture) => (
                        <TodayLectureItem
                            key={`${lecture.lectureId}-${lecture.chapterTitle}`}
                            info={lecture}
                        />
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center text-center">
                        <p className="font-bold text-slate-700">
                            해당 날짜의 수강 이력이 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
