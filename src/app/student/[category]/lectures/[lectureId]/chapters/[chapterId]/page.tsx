import { getChapterVideo, getLectureMeta, getResumeInfo } from "@/app/services/lecture/service";
import ChapterItem from "@/components/common/ChapterItem";
import VideoPlayer from "@/features/lecture/components/common/VideoPlayer";

export default async function ChapterViewPage({ params }: {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>
}) {

    const { chapterId, lectureId } = await params;

    const metaData = await getLectureMeta(lectureId);

    const videoUrl = await getChapterVideo(lectureId, chapterId);

    console.log(videoUrl, '동영상 url');

    const resume =
        await getResumeInfo(
            lectureId,
            chapterId
        );

    const currentChapter =
        metaData.chapters.find(
            (chapter) =>
                chapter.chapterId ===
                Number(chapterId)
        );


    if (!currentChapter) {
        return (
            <div>
                존재하지 않는 챕터입니다.
            </div>
        );
    }

    return (
        <div className="p-12 relative">
            <div className="flex gap-10">

                <VideoPlayer
                    chapter={{
                        ...currentChapter,

                        lectureId:
                            Number(lectureId),

                        videoUrl,

                        watchedSeconds:
                            resume.lastPositionSec,

                        videoSizeBytes: 0,
                        videoStatus: 'READY',
                        originalFilename: ''
                    }}

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
                                lectureId:
                                    Number(lectureId),

                                videoUrl: '',
                                videoSizeBytes: 0,
                                videoStatus: 'READY',
                                originalFilename: ''
                            }}

                            role="student"
                            isEnrolled={true}
                        />
                    ))}

                </div>

            </div>
        </div>
    );
}