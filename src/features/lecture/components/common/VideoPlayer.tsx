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
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";

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
    const initialPlaybackSeconds =
        typeof chapter.chapterProgress === "number" && chapter.chapterProgress > 0
            ? chapter.durationSec * (chapter.chapterProgress / 100)
            : lastPositionSec;
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSavingRef = useRef(false);
    const hasSaveErrorToastShownRef = useRef(false);
    const savePromiseRef = useRef<Promise<UpdateVideoProgressResponse | undefined> | null>(null);
    const playbackSecondsRef = useRef(initialPlaybackSeconds);
    const isCompletedRef = useRef(chapter.isCompleted ?? false);
    const currentPositionRef = useRef(lastPositionSec);
    const lastTrackedPositionRef = useRef(lastPositionSec);
    const lastTrackedAtRef = useRef(0);
    const isPlayingRef = useRef(false);
    const hasMovedToStartPositionRef = useRef(false);
    const seekRetryCountRef = useRef(0);
    const [completedChapterId, setCompletedChapterId] = useState<number | null>(
        chapter.isCompleted ? chapter.chapterId : null
    );
    const [seekRetryTick, setSeekRetryTick] = useState(0);
    const canMoveToNextChapter =
        nextChapterHref &&
        (
            chapter.isCompleted === true ||
            completedChapterId === chapter.chapterId
        );

    const trackWatchedSeconds = useCallback(() => {
        const video = videoRef.current;

        if (!video || !Number.isFinite(video.currentTime)) {
            return playbackSecondsRef.current;
        }

        const now = Date.now();
        const currentTime = video.currentTime;
        const isTrackablePlayback =
            isPlayingRef.current ||
            !video.paused ||
            video.ended;

        if (!isTrackablePlayback) {
            currentPositionRef.current = currentTime;
            lastTrackedPositionRef.current = currentTime;
            lastTrackedAtRef.current = now;

            return playbackSecondsRef.current;
        }

        if (lastTrackedAtRef.current === 0) {
            currentPositionRef.current = currentTime;
            lastTrackedPositionRef.current = currentTime;
            lastTrackedAtRef.current = now;

            return playbackSecondsRef.current;
        }

        const movedSeconds = currentTime - lastTrackedPositionRef.current;
        const elapsedSeconds = (now - lastTrackedAtRef.current) / 1000;
        const allowedMovedSeconds = Math.max(
            4,
            elapsedSeconds + 3
        );

        currentPositionRef.current = video.currentTime;

        // 재생바를 앞으로 크게 당긴 경우에는 실제 시청 시간으로 인정하지 않는다.
        if (movedSeconds > 0 && movedSeconds <= allowedMovedSeconds) {
            playbackSecondsRef.current += movedSeconds;
        }

        lastTrackedPositionRef.current = currentTime;
        lastTrackedAtRef.current = now;

        return playbackSecondsRef.current;
    }, []);

    const getStartPosition = useCallback(() => {
        const startPosition = chapter.isCompleted ? 0 : lastPositionSec;

        return Number.isFinite(startPosition) && startPosition > 0
            ? Math.floor(startPosition)
            : 0;
    }, [
        chapter.isCompleted,
        lastPositionSec,
    ]);

    const syncTrackingPosition = useCallback((position: number) => {
        currentPositionRef.current = position;
        lastTrackedPositionRef.current = position;
        lastTrackedAtRef.current = Date.now();
    }, []);

    const moveToStartPosition = useCallback(() => {
        const video = videoRef.current;

        if (!video || hasMovedToStartPositionRef.current) return;

        const startPosition = getStartPosition();

        if (startPosition <= 0) {
            hasMovedToStartPositionRef.current = true;
            syncTrackingPosition(0);
            return;
        }

        if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
            return;
        }

        const duration = Number.isFinite(video.duration)
            ? video.duration
            : chapter.durationSec;
        const safeStartPosition = Math.min(
            startPosition,
            Math.max(0, Math.floor(duration) - 1)
        );

        try {
            if ("fastSeek" in video && typeof video.fastSeek === "function") {
                video.fastSeek(safeStartPosition);
            } else {
                video.currentTime = safeStartPosition;
            }
        } catch {
            if (seekRetryCountRef.current < 8) {
                seekRetryCountRef.current += 1;
                window.setTimeout(() => {
                    setSeekRetryTick((tick) => tick + 1);
                }, 500);
            }

            return;
        }

        syncTrackingPosition(safeStartPosition);

        window.setTimeout(() => {
            const currentVideo = videoRef.current;

            if (!currentVideo) return;

            const isNearStartPosition =
                Math.abs(currentVideo.currentTime - safeStartPosition) <= 1;

            if (isNearStartPosition) {
                hasMovedToStartPositionRef.current = true;
                syncTrackingPosition(currentVideo.currentTime);
                return;
            }

            if (seekRetryCountRef.current < 8) {
                seekRetryCountRef.current += 1;
                setSeekRetryTick((tick) => tick + 1);
            }
        }, 500);
    }, [
        chapter.durationSec,
        getStartPosition,
        syncTrackingPosition,
    ]);

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
        playbackSeconds?: number,
        { silent = false }: { silent?: boolean } = {}
    ): Promise<UpdateVideoProgressResponse | undefined> => {
        // 중복 저장 요청을 막고 진행 중인 저장 요청이 있으면 같은 Promise를 재사용한다.
        const normalizedPlaybackSeconds = Math.floor(
            playbackSeconds ?? trackWatchedSeconds()
        );
        const normalizedLastPositionSec = Math.floor(
            currentPositionRef.current
        );

        if (normalizedPlaybackSeconds <= 0 && normalizedLastPositionSec <= 0) {
            return undefined;
        }

        if (isSavingRef.current) {
            return savePromiseRef.current ?? undefined;
        }

        isSavingRef.current = true;

        const savePromise = (async () => {
            try {
                // 10초 주기 자동저장은 "나가기"가 아니라서 /exit이 아닌 /progress를 호출하고,
                // 잔디/건물 데이터가 자주 바뀌지 않는 재생 중 시점에 /student 등을 매번 무효화하지 않는다.
                const result = silent
                    ? await updateVideoProgressAction(
                        lectureId,
                        String(chapter.chapterId),
                        { playbackSeconds: normalizedPlaybackSeconds }
                    )
                    : await updateVideoProgressByExitAction(
                        lectureId,
                        String(chapter.chapterId),
                        {
                            playbackSeconds: normalizedPlaybackSeconds,
                            lastPositionSec: normalizedLastPositionSec,
                        }
                    );

                if (result.isCompleted) {
                    markChapterCompleted();
                }

                return result;
            } catch {
                if (!hasSaveErrorToastShownRef.current) {
                    hasSaveErrorToastShownRef.current = true;
                    toast.error("학습 기록 저장에 실패했습니다.");
                }

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
        trackWatchedSeconds,
    ]);

    const handleTimeUpdate = () => {
        trackWatchedSeconds();
    };

    const handlePlay = () => {
        const video = videoRef.current;

        if (!video || !Number.isFinite(video.currentTime)) return;

        isPlayingRef.current = true;
        currentPositionRef.current = video.currentTime;
        lastTrackedPositionRef.current = video.currentTime;
        lastTrackedAtRef.current = Date.now();
    };

    const handlePause = () => {
        trackWatchedSeconds();
        isPlayingRef.current = false;
        void saveProgress();
    };

    const handleSeeking = () => {
        trackWatchedSeconds();

        const video = videoRef.current;

        if (!video || !Number.isFinite(video.currentTime)) return;

        currentPositionRef.current = video.currentTime;
        lastTrackedPositionRef.current = video.currentTime;
        lastTrackedAtRef.current = Date.now();
    };

    const handleLoadedMetadata = () => {
        moveToStartPosition();
    };

    const handleCanPlay = () => {
        if (!hasMovedToStartPositionRef.current) {
            moveToStartPosition();
        }
    };

    useEffect(() => {
        playbackSecondsRef.current = initialPlaybackSeconds;
        currentPositionRef.current = lastPositionSec;
        lastTrackedPositionRef.current = lastPositionSec;
        lastTrackedAtRef.current = Date.now();
        isPlayingRef.current = false;
        isCompletedRef.current = chapter.isCompleted ?? false;
        hasMovedToStartPositionRef.current = false;
        seekRetryCountRef.current = 0;
        hasSaveErrorToastShownRef.current = false;
    }, [
        chapter.chapterId,
        chapter.isCompleted,
        initialPlaybackSeconds,
        lastPositionSec,
    ]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
            moveToStartPosition();
        }
    }, [
        chapter.chapterId,
        moveToStartPosition,
    ]);

    useEffect(() => {
        if (seekRetryTick <= 0) return;

        moveToStartPosition();
    }, [
        moveToStartPosition,
        seekRetryTick,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            void saveProgress(undefined, { silent: true });
        }, 10000);

        return () => {
            clearInterval(interval);
            void saveProgress();
        };
    }, [
        saveProgress,
    ]);

    const handleExit = async () => {
        try {
            const playbackSeconds = Math.floor(trackWatchedSeconds());
            const lastPositionSec = Math.floor(currentPositionRef.current);

            if (playbackSeconds <= 0 && lastPositionSec <= 0) {
                router.push(exitHref);
                return;
            }

            const result = await updateVideoProgressByExitAction(
                lectureId,
                String(chapter.chapterId),
                {
                    playbackSeconds,
                    lastPositionSec,
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
        const trackedPlaybackSeconds = trackWatchedSeconds();
        const duration = videoRef.current?.duration;
        const completedSeconds =
            duration && Number.isFinite(duration)
                ? duration
                : chapter.durationSec;

        if (completedSeconds - trackedPlaybackSeconds <= 5) {
            playbackSecondsRef.current = Math.max(
                playbackSecondsRef.current,
                completedSeconds
            );
        }

        currentPositionRef.current = completedSeconds;

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
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeeking={handleSeeking}
                    onLoadedMetadata={handleLoadedMetadata}
                    onLoadedData={handleCanPlay}
                    onCanPlay={handleCanPlay}
                    onCanPlayThrough={handleCanPlay}
                    onProgress={handleCanPlay}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                    preload="metadata"
                    className="aspect-video w-full bg-black"
                >
                    <source
                        src={presignedUrl}
                        type="video/mp4"
                    />

                    브라우저가 video 태그를 지원하지 않습니다.
                </video>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_1fr_140px_auto] md:gap-6">
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

                <div className="flex items-start justify-end">
                    <CreateReportBtn
                        triggerLabel="챕터 신고"
                        triggerClassName="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100"
                        targetType="CHAPTER"
                        targetId={chapter.chapterId}
                    />
                </div>
            </div>
        </section>
    );
}
