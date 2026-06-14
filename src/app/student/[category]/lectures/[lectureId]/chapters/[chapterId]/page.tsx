import { notFound } from "next/navigation";

import {
    getChapterVideo,
    getLectureMeta,
    getResumeInfo,
} from "@/app/services/lecture/service";
import VideoPlayer from "@/features/lecture/components/common/VideoPlayer";
import ChapterDetailList from "@/features/lecture/components/student/ChapterDetailList";
import ChapterStudyInfoCard from "@/features/lecture/components/student/ChapterStudyInfoCard";
import getCategoryMeta from "@/features/lecture/components/student/category";
import { CategoryUrl, Chapter } from "@/features/lecture/type";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface ChapterViewPageProps {
    params: Promise<{
        category: CategoryUrl;
        chapterId: string;
        lectureId: string;
    }>;
}

export default async function ChapterViewPage({
    params,
}: ChapterViewPageProps) {
    const {
        category,
        chapterId,
        lectureId,
    } = await params;

    const categoryMeta = getCategoryMeta(category);
    const metaData = await getLectureMeta(lectureId);

    if (!metaData) {
        throw new Error("강의 정보를 불러올 수 없습니다.");
    }

    const videoUrl = await getChapterVideo(
        lectureId,
        chapterId
    );
    const resume = await getResumeInfo(
        lectureId,
        chapterId
    );

    const currentChapter = metaData.chapters.find(
        (chapter) => chapter.chapterId === Number(chapterId)
    );

    if (!currentChapter) {
        notFound();
    }

    const chapters: Chapter[] = metaData.chapters.map((chapter) => ({
        ...chapter,
        lectureId: Number(lectureId),
        videoUrl: "",
        videoSizeBytes: 0,
        videoStatus: "READY",
        originalFilename: "",
    }));

    const playerChapter: Chapter = {
        ...currentChapter,
        lectureId: Number(lectureId),
        videoUrl,
        watchedSeconds: resume.lastPositionSec,
        videoSizeBytes: 0,
        videoStatus: "READY",
        originalFilename: "",
    };

    const completedCount = metaData.chapters.filter(
        (chapter) => chapter.isCompleted
    ).length;

    const currentChapterIndex = metaData.chapters.findIndex(
        (chapter) => chapter.chapterId === Number(chapterId)
    );
    const nextChapter = metaData.chapters[currentChapterIndex + 1];
    const nextChapterHref = nextChapter && nextChapter.isAccessible !== false
        ? `/student/${category}/lectures/${lectureId}/chapters/${nextChapter.chapterId}`
        : undefined;

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_360px] gap-8 px-12 py-12">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={`/student/${category}/lectures/${lectureId}`}
                    breadcrumbs={[
                        {
                            label: "홈",
                            href: "/student",
                        },
                        {
                            label: `${categoryMeta.label} 강의`,
                            href: `/student/${category}/lectures`,
                        },
                        {
                            label: metaData.lectureTitle,
                            href: `/student/${category}/lectures/${lectureId}`,
                        },
                        {
                            label: `Chapter ${currentChapter.orderNo}.`,
                        },
                    ]}
                    title={`Chapter ${currentChapter.orderNo}. ${currentChapter.title}`}
                />

                <VideoPlayer
                    chapter={playerChapter}
                    lectureTitle={metaData.lectureTitle}
                    currentChapterNo={metaData.currentChapterNo}
                    totalChapterCount={metaData.totalChapterCount}
                    nextChapterHref={nextChapterHref}
                />

                <ChapterStudyInfoCard />
            </section>

            <aside className="sticky top-10 self-start">
                <ChapterDetailList
                    category={category}
                    lectureId={lectureId}
                    currentChapterId={Number(chapterId)}
                    chapters={chapters}
                    completedCount={completedCount}
                    totalChapterCount={metaData.totalChapterCount}
                />
            </aside>
        </main>
    );
}
