import ChapterItem from "@/components/common/ChapterItem";
import { Chapter } from "../../page";

export default async function ChapterDetailPage({ params }: {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>
}) {
    const { chapterId, lectureId } = await params;

    const dummyChapters: Chapter[] = [
        { id: 1, orderNo: 1, title: '오리엔테이션 및 준비운동', duration: '10:30' },
        { id: 2, orderNo: 2, title: '상체 근력 운동 기초', duration: '15:20' },
        { id: 3, orderNo: 3, title: '하체 근력 운동 기초', duration: '12:45' },
        { id: 4, orderNo: 4, title: '코어 운동으로 체간 강화', duration: '14:00' },
        { id: 5, orderNo: 5, title: '유산소 운동 루틴', duration: '18:30' },
        { id: 6, orderNo: 6, title: '스트레칭과 마무리', duration: '10:00' },
    ];

    const chapter: Chapter | undefined = dummyChapters.find((chapter) => chapter.id === Number(chapterId));

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
                        <ChapterItem key={item.id} chapter={item} role="admin" />
                    ))}
                </div>
            </div>
        </div>
    );
}