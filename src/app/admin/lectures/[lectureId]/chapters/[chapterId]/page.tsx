import { getChapterVideo, getLectureMeta, getResumeInfo } from "@/app/services/lecture/service";
import ChapterItem from "@/components/common/ChapterItem";
import LecturePreviewPlayer from "@/features/lecture/components/common/LecturePreviewPlayer";
import { notFound } from "next/navigation";

export default async function ChapterDetailPage({ params }: {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>
}) {
    const { chapterId, lectureId } = await params;


    const metaData = await getLectureMeta(lectureId);

    if (!metaData) {
        throw new Error('강의 정보를 불러올 수 없습니다.');
    }

    const videoUrl = await getChapterVideo(lectureId, chapterId);

    const currentChapter =
        metaData.chapters.find(
            (chapter) =>
                chapter.chapterId ===
                Number(chapterId)
        );

    if (!currentChapter) {
        notFound();
    }

    return (
        <div>
            <div className="flex gap-10">
                <LecturePreviewPlayer
                    title={currentChapter.title}
                    durationSec={currentChapter.durationSec}
                    videoUrl={videoUrl}
                    currentChapterNo={
                        metaData.currentChapterNo
                    }

                    totalChapterCount={
                        metaData.totalChapterCount
                    }
                />
                <div className="flex-1 h-120 bg-white border-2 border-slate-200 rounded-lg p-4 overflow-y-auto">
                    {metaData.chapters.map((item) => (
                        <ChapterItem
                            key={item.chapterId}

                            chapter={{
                                ...item,
                            }}

                            role="admin"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
