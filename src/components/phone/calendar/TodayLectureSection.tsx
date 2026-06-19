import TodayLectureItem from "@/features/phone/components/todo/TodayLectureItem";
// props : {lectureId , (chapterId) , lectureTitle , chapterTitle , watchedSecond} []
export default function TodayLectureSection() {
    return (
        <div className='p-4 flex flex-col gap-3 h-[196px]'>
            <h2 className="text-xl text-slate-900 text-center font-extrabold">
                수강 이력
            </h2>

            <div className='grid grid-cols-1 gap-2 h-full scrollbar-none overflow-auto pt-0.5'>
                {/* map으로 해당 날짜의 수강 이력 목록 뿌리기 */}
                <TodayLectureItem />
                <TodayLectureItem />
                <TodayLectureItem />
                <TodayLectureItem />
                <TodayLectureItem />
                <TodayLectureItem />
            </div>
        </div>
    );
}