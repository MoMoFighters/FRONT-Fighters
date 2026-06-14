"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    updateVideoProgressAction,
    updateVideoProgressByExitAction,
} from "@/features/lecture/action";
import { Chapter } from "@/features/lecture/type";
import TwoButtonModal from "@/features/modal/TwoButtonModal";

interface VideoPlayerProps {
    chapter: Chapter;
    lectureTitle: string;
    currentChapterNo: number;
    totalChapterCount: number;
    nextChapterHref?: string;
}

const formatDuration = (durationSec: number) => {
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function VideoPlayer({
    chapter,
    lectureTitle,
    currentChapterNo,
    totalChapterCount,
    nextChapterHref,
}: VideoPlayerProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSavingRef = useRef(false);
    const watchedSecondsRef = useRef(chapter.watchedSeconds ?? 0);
    const isCompletedRef = useRef(chapter.isCompleted ?? false);
    const currentPositionRef = useRef(chapter.watchedSeconds ?? 0);
    const [isEnded, setIsEnded] = useState(false);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;
        currentPositionRef.current = currentTime;

        if (currentTime <= watchedSecondsRef.current + 2) {
            watchedSecondsRef.current = Math.max(
                watchedSecondsRef.current,
                currentTime
            );
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const handleLoadedMetadata = () => {
            video.currentTime = chapter.watchedSeconds ?? 0;
        };

        video.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        return () => {
            video.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );
        };
    }, [
        chapter.chapterId,
        chapter.watchedSeconds,
    ]);

    useEffect(() => {
        setIsEnded(false);
    }, [chapter.chapterId]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (isSavingRef.current) return;

            isSavingRef.current = true;

            try {
                const result = await updateVideoProgressAction(
                    String(chapter.lectureId),
                    String(chapter.chapterId),
                    {
                        playbackSeconds: Math.floor(
                            watchedSecondsRef.current
                        ),
                    }
                );

                if (
                    result.isCompleted &&
                    !isCompletedRef.current
                ) {
                    isCompletedRef.current = true;

                    toast.success("챕터 수강 완료!");
                }
            } catch (error) {
                console.error(error);
            } finally {
                isSavingRef.current = false;
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [
        chapter.chapterId,
        chapter.lectureId,
    ]);

    const handleExit = async () => {
        try {
            await updateVideoProgressByExitAction(
                String(chapter.lectureId),
                String(chapter.chapterId),
                {
                    playbackSeconds: Math.floor(
                        watchedSecondsRef.current
                    ),
                    lastPositionSec: Math.floor(
                        currentPositionRef.current
                    ),
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            router.back();
        }
    };

    const handleVideoEnded = () => {
        setIsEnded(true);
        router.refresh();
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative bg-black">
                <TwoButtonModal
                    trigger={(
                        <button
                            type="button"
                            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white transition hover:bg-black/60"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    title="영상 시청을 그만두시겠습니까?"
                    description="지금까지 시청한 기록이 저장됩니다."
                    onConfirm={handleExit}
                />

                {isEnded && nextChapterHref && (
                    <Link
                        href={nextChapterHref}
                        className="absolute right-4 top-4 z-10 flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-slate-100"
                    >
                        다음 챕터
                    </Link>
                )}

                <video
                    ref={videoRef}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    className="aspect-video w-full bg-black"
                >
                    <source
                        src={chapter.videoUrl}
                        type="video/mp4"
                    />

                    브라우저가 video 태그를 지원하지 않습니다.
                </video>
            </div>

            <div className="grid grid-cols-[1fr_1fr_140px] gap-6 p-5">
                <div>
                    <p className="text-xs font-bold text-slate-400">
                        강의명
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-950">
                        {lectureTitle}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-400">
                        현재 챕터
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-950">
                        Chapter {currentChapterNo}. {chapter.title}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                        학습 기록 자동 저장 중
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-400">
                        챕터 시간
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-950">
                        {formatDuration(chapter.durationSec)}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-slate-400">
                        {currentChapterNo} / {totalChapterCount}
                    </p>
                </div>
            </div>
        </section>
    );
}
