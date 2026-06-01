'use client'

import { useEffect, useRef } from "react";
import { Chapter } from "../../type";
import TwoButtonModal from "@/features/modal/TwoButtonModal";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateVideoProgressAction, updateVideoProgressByExitAction } from "../../action";

interface VideoPlayerProps {
    chapter: Chapter;
    currentChapterNo: number;
    totalChapterCount: number;
}

export default function VideoPlayer({
    chapter,
    currentChapterNo,
    totalChapterCount
}: VideoPlayerProps) {

    const router = useRouter();

    const videoRef =
        useRef<HTMLVideoElement>(null);

    const isSavingRef =
        useRef(false);

    const watchedSecondsRef =
        useRef(
            chapter.watchedSeconds ?? 0
        );

    const currentPositionRef =
        useRef(
            chapter.watchedSeconds ?? 0
        );

    const handleTimeUpdate = () => {

        if (!videoRef.current) return;

        const currentTime =
            videoRef.current.currentTime;

        currentPositionRef.current =
            currentTime;

        if (
            currentTime <=
            watchedSecondsRef.current + 2
        ) {
            watchedSecondsRef.current =
                Math.max(
                    watchedSecondsRef.current,
                    currentTime
                );
        }
    };

    useEffect(() => {

        const video =
            videoRef.current;

        if (!video) return;

        const handleLoadedMetadata =
            () => {

                video.currentTime =
                    chapter.watchedSeconds ?? 0;
            };

        video.addEventListener(
            'loadedmetadata',
            handleLoadedMetadata
        );

        return () => {

            video.removeEventListener(
                'loadedmetadata',
                handleLoadedMetadata
            );
        };

    }, [chapter.chapterId]);

    useEffect(() => {

        const interval =
            setInterval(async () => {

                if (
                    isSavingRef.current
                ) return;

                isSavingRef.current =
                    true;

                try {

                    console.log(
                        'ref',
                        watchedSecondsRef.current
                    );

                    const result =
                        await updateVideoProgressAction(
                            String(
                                chapter.lectureId
                            ),
                            String(
                                chapter.chapterId
                            ),
                            {
                                playbackSeconds:
                                    Math.floor(
                                        watchedSecondsRef.current
                                    )
                            }
                        );

                    console.log(
                        'server',
                        result.watchedSeconds
                    );

                } catch (error) {

                    console.error(error);

                } finally {

                    isSavingRef.current =
                        false;
                }

            }, 10000);

        return () =>
            clearInterval(interval);

    }, [chapter.chapterId]);

    const handleExit =
        async () => {

            try {

                await updateVideoProgressByExitAction(
                    String(
                        chapter.lectureId
                    ),
                    String(
                        chapter.chapterId
                    ),
                    {
                        playbackSeconds:
                            Math.floor(
                                watchedSecondsRef.current
                            ),

                        lastPositionSec:
                            Math.floor(
                                currentPositionRef.current
                            )
                    }
                );

            } catch (error) {

                console.error(error);

            } finally {

                router.back();
            }
        };

    return (
        <div className="flex flex-col">

            <TwoButtonModal
                trigger={
                    <ArrowLeft
                        className="
                            absolute top-4 left-4
                            w-6 h-6
                            hover:text-slate-400
                            cursor-pointer
                            text-slate-300
                        "
                    />
                }
                title="영상 시청을 그만두시겠습니까?"
                description="지금까지 시청한 기록이 저장됩니다."
                onConfirm={handleExit}
            />

            <video
                ref={videoRef}
                controls
                onTimeUpdate={
                    handleTimeUpdate
                }
                className="
                    w-160 h-90
                    rounded-tl-lg
                    rounded-tr-lg
                    bg-black
                "
            >
                <source
                    src={chapter.videoUrl}
                    type="video/mp4"
                />

                브라우저가 video 태그를 지원하지 않습니다.
            </video>

            <div
                className="
                    flex-1
                    bg-slate-500
                    border
                    rounded-bl-lg
                    rounded-br-lg
                    px-10
                    pt-8
                "
            >
                <p
                    className="
                        text-slate-50
                        font-bold
                        text-xl
                        mb-3
                    "
                >
                    {chapter.title}
                </p>

                <p
                    className="
                        text-slate-200
                        font-semibold
                        text-sm
                    "
                >
                    {`${String(
                        Math.floor(
                            chapter.durationSec / 60
                        )
                    ).padStart(2, '0')}:${String(
                        chapter.durationSec % 60
                    ).padStart(2, '0')}`}

                    {" "}· 챕터 : {currentChapterNo}/{totalChapterCount}
                </p>
            </div>

        </div>
    );
}