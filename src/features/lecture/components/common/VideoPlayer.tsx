"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    updateVideoProgressAction,
    updateVideoProgressByExitAction,
} from "@/features/lecture/action";
import {
    ChapterByMeta,
    UpdateVideoProgressResponse,
} from "@/features/lecture/type";
import TwoButtonModal from "@/features/modal/TwoButtonModal";

interface VideoPlayerProps {
    lectureId: string;
    chapter: ChapterByMeta;
    lectureTitle: string;
    currentChapterNo: number;
    presignedUrl: string;
    lastPositionSec: number;
    exitHref: string;
    nextChapterHref?: string;
}

const formatDuration = (durationSec: number) => {
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default function VideoPlayer({
    lectureId,
    chapter,
    lectureTitle,
    currentChapterNo,
    presignedUrl,
    lastPositionSec,
    exitHref,
    nextChapterHref,
}: VideoPlayerProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSavingRef = useRef(false);
    const savePromiseRef = useRef<Promise<UpdateVideoProgressResponse | undefined> | null>(null);
    const playbackSecondsRef = useRef(lastPositionSec);
    const isCompletedRef = useRef(chapter.isCompleted ?? false);
    const currentPositionRef = useRef(lastPositionSec);
    const [completedChapterId, setCompletedChapterId] = useState<number | null>(
        chapter.isCompleted ? chapter.chapterId : null
    );
    const canMoveToNextChapter =
        nextChapterHref &&
        (
            chapter.isCompleted === true ||
            completedChapterId === chapter.chapterId
        );

    const markChapterCompleted = useCallback(() => {
        if (isCompletedRef.current) return;

        isCompletedRef.current = true;
        setCompletedChapterId(chapter.chapterId);
        toast.success("현재 챕터 학습이 완료되었습니다.");
        router.refresh();
    }, [
        chapter.chapterId,
        router,
    ]);

    const saveProgress = useCallback(async (
        playbackSeconds = playbackSecondsRef.current
    ): Promise<UpdateVideoProgressResponse | undefined> => {
        if (isSavingRef.current) {
            return savePromiseRef.current ?? undefined;
        }

        isSavingRef.current = true;

        const savePromise = (async () => {
            try {
                const result = await updateVideoProgressAction(
                    lectureId,
                    String(chapter.chapterId),
                    {
                        playbackSeconds: Math.floor(playbackSeconds),
                    }
                );

                if (result.isCompleted) {
                    markChapterCompleted();
                }

                return result;
            } catch (error) {
                console.error(error);
                return undefined;
            } finally {
                isSavingRef.current = false;
                savePromiseRef.current = null;
            }
        })();

        savePromiseRef.current = savePromise;

        return savePromise;
    }, [
        chapter.chapterId,
        lectureId,
        markChapterCompleted,
    ]);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;
        currentPositionRef.current = currentTime;

        if (currentTime <= playbackSecondsRef.current + 2) {
            playbackSecondsRef.current = Math.max(
                playbackSecondsRef.current,
                currentTime
            );
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const handleLoadedMetadata = () => {
            video.currentTime = chapter.isCompleted ? 0 : lastPositionSec;
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
        chapter.isCompleted,
        lastPositionSec,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            void saveProgress();
        }, 20000);

        return () => clearInterval(interval);
    }, [
        saveProgress,
    ]);

    const handleExit = async () => {
        try {
            const result = await updateVideoProgressByExitAction(
                lectureId,
                String(chapter.chapterId),
                {
                    playbackSeconds: Math.floor(
                        playbackSecondsRef.current
                    ),
                    lastPositionSec: Math.floor(
                        currentPositionRef.current
                    ),
                }
            );

            if (result.isCompleted) {
                markChapterCompleted();
            }
        } catch {
            toast.error("학습 기록 저장에 실패했습니다.");
        } finally {
            router.push(exitHref);
        }
    };

    const handleVideoEnded = async () => {
        const duration = videoRef.current?.duration;
        const completedSeconds =
            duration && Number.isFinite(duration)
                ? duration
                : chapter.durationSec;

        playbackSecondsRef.current = Math.max(
            playbackSecondsRef.current,
            completedSeconds
        );
        currentPositionRef.current = playbackSecondsRef.current;

        if (isSavingRef.current && savePromiseRef.current) {
            await savePromiseRef.current;
        }

        await saveProgress(playbackSecondsRef.current);
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

                {canMoveToNextChapter && (
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
                        src={presignedUrl}
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
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-400">
                        챕터 시간
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-950">
                        {formatDuration(chapter.durationSec)}
                    </p>
                </div>
            </div>
        </section>
    );
}
