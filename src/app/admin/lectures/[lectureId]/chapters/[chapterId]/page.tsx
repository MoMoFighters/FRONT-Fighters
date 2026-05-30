import ChapterItem from "@/components/common/ChapterItem";
import { Chapter } from "@/features/lecture/type";

export default async function ChapterDetailPage({ params }: {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>
}) {
    const { chapterId, lectureId } = await params;


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