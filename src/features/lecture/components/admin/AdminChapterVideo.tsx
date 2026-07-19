import { Chapter } from "@/features/lecture/type";
import AdminLectureDeleteButton from "./AdminLectureDeleteButton";

interface AdminChapterVideoProps {
    lectureId: string;
    lectureTitle: string;
    chapter: Chapter;
    presignedUrl: string;
    canDelete?: boolean;
}

const formatDuration = (durationSec: number) => {
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function AdminChapterVideo({
    lectureId,
    lectureTitle,
    chapter,
    presignedUrl,
    canDelete = true,
}: AdminChapterVideoProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-black">
                <video controls preload="metadata" className="aspect-video w-full bg-black">
                    <source src={presignedUrl} type="video/mp4" />
                    브라우저가 video 태그를 지원하지 않습니다.
                </video>
            </div>
            <div className="flex items-center justify-between gap-6 p-5">
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
                    <div>
                        <p className="text-xs font-bold text-slate-400">강의명</p>
                        <p className="mt-1 font-bold text-slate-950">{lectureTitle}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400">챕터</p>
                        <p className="mt-1 font-bold text-slate-950">Chapter {chapter.orderNo}. {chapter.title}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400">영상 길이</p>
                        <p className="mt-1 font-bold text-slate-950">{formatDuration(chapter.durationSec)}</p>
                    </div>
                </div>
                {canDelete && (
                    <AdminLectureDeleteButton
                        target="챕터"
                        targetId={chapter.chapterId}
                        lectureId={lectureId}
                        variant="button"
                        successHref={`/admin/lectures/${lectureId}`}
                    />
                )}
            </div>
        </section>
    );
}
