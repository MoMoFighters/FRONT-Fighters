import { notFound } from "next/navigation";

import {
    getLectureMeta,
    getVideoPlayer,
} from "@/app/services/lecture/service";
import VideoPlayer from "@/features/lecture/components/common/VideoPlayer";
import ChapterDetailList from "@/features/lecture/components/student/chapter-detail/ChapterDetailList";
import ChapterStudyInfoCard from "@/features/lecture/components/student/chapter-detail/ChapterStudyInfoCard";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface MyChapterViewPageProps {
    params: Promise<{
        chapterId: string;
        lectureId: string;
    }>;
}

export default async function MyChapterViewPage({
    params,
}: MyChapterViewPageProps) {
    const {
        chapterId,
        lectureId,
    } = await params;

    const [metaData, playerData] = await Promise.all([
        getLectureMeta(lectureId),
        getVideoPlayer(lectureId, chapterId),
    ]);

    if (!metaData) {
        throw new Error("강의 정보를 불러올 수 없습니다.");
    }

    const currentChapter = metaData.chapters.find(
        (chapter) => chapter.chapterId === Number(chapterId)
    );

    if (!currentChapter) {
        notFound();
    }

    const completedCount = metaData.chapters.filter(
        (chapter) => chapter.isCompleted
    ).length;

    const currentChapterIndex = metaData.chapters.findIndex(
        (chapter) => chapter.chapterId === Number(chapterId)
    );
    const nextChapter = metaData.chapters[currentChapterIndex + 1];
    const chapterBaseHref = `/student/mypage/lectures/${lectureId}`;
    const nextChapterHref = nextChapter && nextChapter.isAccessible === true
        ? `${chapterBaseHref}/chapters/${nextChapter.chapterId}`
        : undefined;

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] md:px-12 md:py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={`/student/mypage/lectures/${lectureId}`}
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: "마이페이지",
                            href: "/student/mypage",
                        },
                        {
                            label: "내 강의",
                            href: "/student/mypage",
                        },
                        {
                            label: metaData.lectureTitle,
                            href: `/student/mypage/lectures/${lectureId}`,
                        },
                        {
                            label: `Chapter ${currentChapter.orderNo}.`,
                        },
                    ]}
                    title={`Chapter ${currentChapter.orderNo}. ${currentChapter.title}`}
                />

                <VideoPlayer
                    lectureId={lectureId}
                    chapter={currentChapter}
                    lectureTitle={metaData.lectureTitle}
                    currentChapterNo={currentChapter.orderNo}
                    presignedUrl={playerData.presignedUrl}
                    lastPositionSec={playerData.lastPositionSec}
                    exitHref={`/student/mypage/lectures/${lectureId}`}
                    nextChapterHref={nextChapterHref}
                />

                <ChapterStudyInfoCard />
            </section>

            <aside className="sticky mt-4 top-5 self-start">
                <ChapterDetailList
                    category=""
                    lectureId={lectureId}
                    currentChapterId={Number(chapterId)}
                    chapters={metaData.chapters}
                    completedCount={completedCount}
                    totalChapterCount={metaData.totalChapterCount}
                    chapterBaseHref={chapterBaseHref}
                />
            </aside>
        </main>
    );
}
