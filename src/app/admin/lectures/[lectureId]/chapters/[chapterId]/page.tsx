import ChapterItem from "@/components/common/ChapterItem";
import { Chapter } from "@/features/lecture/type";

export default async function ChapterDetailPage({ params }: {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>
}) {
    const { chapterId, lectureId } = await params;


    const dummyChapters: Chapter[] = [
        {
            chapterId: 1,
            lectureId: 1,
            title: "강의 소개",
            orderNo: 1,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            videoSizeBytes: 104857600,
            videoStatus: "READY",
            durationSec: 600,
            originalFilename: "intro.mp4",
            progressRate: 100,
            watchedSeconds: 600,
            isCompleted: true,
        },
        {
            chapterId: 2,
            lectureId: 1,
            title: "변수와 타입",
            orderNo: 2,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            videoSizeBytes: 209715200,
            videoStatus: "READY",
            durationSec: 900,
            originalFilename: "variable.mp4",
            progressRate: 70,
            watchedSeconds: 630,
            isCompleted: false,
        },
        {
            chapterId: 3,
            lectureId: 1,
            title: "함수",
            orderNo: 3,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            videoSizeBytes: 314572800,
            videoStatus: "READY",
            durationSec: 1200,
            originalFilename: "function.mp4",
            progressRate: 35,
            watchedSeconds: 420,
            isCompleted: false,
        },
        {
            chapterId: 4,
            lectureId: 1,
            title: "객체",
            orderNo: 4,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            videoSizeBytes: 419430400,
            videoStatus: "READY",
            durationSec: 1500,
            originalFilename: "object.mp4",
            progressRate: 0,
            watchedSeconds: 0,
            isCompleted: false,
        },
        {
            chapterId: 5,
            lectureId: 1,
            title: "비동기 처리",
            orderNo: 5,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            videoSizeBytes: 524288000,
            videoStatus: "READY",
            durationSec: 1800,
            originalFilename: "async.mp4",
            progressRate: 0,
            watchedSeconds: 0,
            isCompleted: false,
        },
    ];

    const currentChapter = dummyChapters.find((item) => item.chapterId === Number(chapterId));

    if (!currentChapter) {
        return (
            <div>
                존재하지 않는 챕터입니다.
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-10">
                <div className="bg-slate-300 w-160 h-90 rounded-lg">
                    {currentChapter?.title}
                </div>
                <div className="flex-1 h-120 bg-white border-2 border-slate-200 rounded-lg p-4 overflow-y-auto">
                    {dummyChapters.map((item) => (
                        <div
                            key={item.chapterId}
                            className={
                                item.chapterId === Number(chapterId)
                                    ? "ring-2 ring-green-400 rounded-lg"
                                    : ""
                            }
                        >
                            <ChapterItem
                                chapter={item}
                                role="admin"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}