import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLectureByIdForGuest } from "@/app/services/lecture/service";
import GuestLectureAside from "@/features/lecture/components/guest/GuestLectureAside";
import GuestLectureDetailHero from "@/features/lecture/components/guest/GuestLectureDetailHero";
import GuestLockedChapterList from "@/features/lecture/components/guest/GuestLockedChapterList";

interface GuestLectureDetailPageProps {
    params: Promise<{
        lectureId: string;
    }>;
}

export const generateMetadata = async ({
    params,
}: GuestLectureDetailPageProps): Promise<Metadata> => {
    const { lectureId } = await params;

    try {
        const lecture = await getLectureByIdForGuest(lectureId);

        return {
            title: `${lecture.title} | 모모시티`,
            description: lecture.description,
            alternates: {
                canonical: `/lectures/${lectureId}`,
            },
            openGraph: {
                title: `${lecture.title} | 모모시티`,
                description: lecture.description,
                images: lecture.thumbnailUrl
                    ? [
                        {
                            url: lecture.thumbnailUrl,
                            alt: `${lecture.title} 강의 썸네일`,
                        },
                    ]
                    : undefined,
            },
        };
    } catch {
        return {
            title: "강의 상세 | 모모시티",
            description: "모모시티 강의 상세 페이지입니다.",
        };
    }
};

export default async function GuestLectureDetailPage({
    params,
}: GuestLectureDetailPageProps) {
    const { lectureId } = await params;
    const lecture = await getLectureByIdForGuest(lectureId);

    if (!lecture) {
        notFound();
    }

    if (lecture.lectureStatus !== "ACTIVE") {
        throw new Error("403|접근할 수 없는 상태의 강의입니다.");
    }

    return (
        <main className="mx-auto grid w-full max-w-360 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] md:px-16">
            <section className="min-w-0">
                <GuestLectureDetailHero lecture={lecture} />

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <p className="text-xs font-bold text-indigo-500">
                            CURRICULUM
                        </p>
                        <div className="mt-2 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">
                                    강의 챕터
                                </h2>
                            </div>

                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                                총 {lecture.chapters.length}개
                            </span>
                        </div>
                    </div>

                    <GuestLockedChapterList chapters={lecture.chapters} />
                </section>
            </section>

            <GuestLectureAside />
        </main>
    );
}
