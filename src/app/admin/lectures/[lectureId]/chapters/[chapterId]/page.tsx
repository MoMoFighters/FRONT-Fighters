import { notFound } from "next/navigation";

import { getLectureMeta, getVideoPlayer } from "@/app/services/lecture/service";
import AdminChapterList from "@/features/lecture/components/admin/AdminChapterList";
import AdminChapterVideo from "@/features/lecture/components/admin/AdminChapterVideo";
import StudentPageHeader from "@/features/student/components/StudentPageHeader";

interface AdminChapterDetailPageProps {
    params: Promise<{ lectureId: string; chapterId: string }>;
}

export default async function AdminChapterDetailPage({
    params,
}: AdminChapterDetailPageProps) {
    const { lectureId, chapterId } = await params;
    const metaData = await getLectureMeta(lectureId);
    const playerData = await getVideoPlayer(lectureId, chapterId);

    if (!metaData) {
        throw new Error("강의 정보를 불러올 수 없습니다.");
    }

    const currentChapter = metaData.chapters.find(
        (chapter) => chapter.chapterId === Number(chapterId),
    );

    if (!currentChapter) notFound();

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-[minmax(0,1fr)_360px] gap-8 pb-10">
            <section className="min-w-0">
                <StudentPageHeader
                    backHref={`/admin/lectures/${lectureId}`}
                    breadcrumbs={[
                        { label: "관리자", href: "/admin" },
                        { label: "강의 관리", href: "/admin/lectures" },
                        { label: metaData.lectureTitle, href: `/admin/lectures/${lectureId}` },
                        { label: `Chapter ${currentChapter.orderNo}.` },
                    ]}
                    title={`Chapter ${currentChapter.orderNo}. ${currentChapter.title}`}
                />

                <AdminChapterVideo
                    lectureId={lectureId}
                    lectureTitle={metaData.lectureTitle}
                    chapter={currentChapter}
                    presignedUrl={playerData.presignedUrl}
                />
            </section>

            <aside className="sticky mt-4 top-5 self-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-base font-bold text-slate-950">강의 챕터</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">전체 {metaData.totalChapterCount}개 챕터</p>
                </div>
                <AdminChapterList
                    lectureId={lectureId}
                    chapters={metaData.chapters}
                    currentChapterId={currentChapter.chapterId}
                />
            </aside>
        </main>
    );
}
