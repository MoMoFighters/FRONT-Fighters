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
            lectureId: 10,
            title: "강의 소개 및 환경 설정",
            orderNo: 1,
            videoUrl: "https://example.com/videos/chapter1.mp4",
            videoSizeBytes: 104857600, // 100MB
            videoStatus: "READY",
            durationSec: 780,
            originalFilename: "chapter1-intro.mp4",
        },
        {
            chapterId: 2,
            lectureId: 10,
            title: "Spring Boot 프로젝트 생성",
            orderNo: 2,
            videoUrl: "https://example.com/videos/chapter2.mp4",
            videoSizeBytes: 157286400, // 150MB
            videoStatus: "READY",
            durationSec: 1320,
            originalFilename: "chapter2-project.mp4",
        },
        {
            chapterId: 3,
            lectureId: 10,
            title: "REST API 기본 구현",
            orderNo: 3,
            videoUrl: "https://example.com/videos/chapter3.mp4",
            videoSizeBytes: 209715200, // 200MB
            videoStatus: "READY",
            durationSec: 1850,
            originalFilename: "chapter3-rest-api.mp4",
        },
        {
            chapterId: 4,
            lectureId: 10,
            title: "데이터베이스 연동하기",
            orderNo: 4,
            videoUrl: "https://example.com/videos/chapter4.mp4",
            videoSizeBytes: 262144000, // 250MB
            videoStatus: "PROCESSING",
            durationSec: 2100,
            originalFilename: "chapter4-database.mp4",
        },
        {
            chapterId: 5,
            lectureId: 10,
            title: "배포 및 마무리",
            orderNo: 5,
            videoUrl: "https://example.com/videos/chapter5.mp4",
            videoSizeBytes: 125829120, // 120MB
            videoStatus: "READY",
            durationSec: 960,
            originalFilename: "chapter5-deploy.mp4",
        },
    ];

    const chapter = dummyChapters.find((chapter) => chapter.chapterId === Number(chapterId));

    if (!chapter) {
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
                    {chapter?.title}
                </div>
                <div className="flex-1 h-120 bg-white border-2 border-slate-200 rounded-lg p-4 overflow-y-auto">
                    {dummyChapters.map((item) => (
                        <ChapterItem key={item.chapterId} chapter={item} role="admin" />
                    ))}
                </div>
            </div>
        </div>
    );
}