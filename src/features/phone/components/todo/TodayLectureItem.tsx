import Link from "next/link";

// props : lectureId , (chapterId) , lectureTitle , chapterTitle , watchedSecond
export default function TodayLectureItem() {
    const link = '/student/fitness/lectures'
    return (
        <Link href={link}>
            <div
                className='bg-indigo-200 w-full h-14 rounded-md p-2 flex flex-col justify-center hover:bg-indigo-300 cursor-pointer'
            >
                <h3 className="text-md font-bold">강의제목제목</h3>
                <div className="flex flex-row justify-between">
                    <p className="text-[12px]">챕터제목제목</p>
                    <span className="text-right text-[12px]">1분 10초</span>
                </div>
            </div>
        </Link>
    );
}