"use client";

import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { BookOpen, Coffee, History, Video, VideoOff } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

// 사람으로 인식할 최소 신뢰도 - 너무 민감하게 반응하지 않도록 여유 있게 설정
const PERSON_SCORE_THRESHOLD = 0.5;
// 사람이 화면에서 사라진 뒤 타이머를 일시정지하기까지 대기하는 시간(초)
const ABSENCE_TIMEOUT_SECONDS = 10;

type CameraStatus = "off" | "loading" | "ready" | "error";

interface StudyWebcamPreviewProps {
    isTimerRunning: boolean;
    onAbsenceTimeout: () => void;
    onOpenLaps: () => void;
}

export default function StudyWebcamPreview({
    isTimerRunning,
    onAbsenceTimeout,
    onOpenLaps,
}: StudyWebcamPreviewProps) {
    const [status, setStatus] = useState<CameraStatus>("off");
    const [error, setError] = useState("");
    const [personDetected, setPersonDetected] = useState(true);
    const [absenceSeconds, setAbsenceSeconds] = useState<number | null>(null);
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
    const rafRef = useRef<number>(0);
    const onAbsenceTimeoutRef = useRef(onAbsenceTimeout);

    useEffect(() => {
        onAbsenceTimeoutRef.current = onAbsenceTimeout;
    }, [onAbsenceTimeout]);

    // 언마운트 시 카메라/모델 완전히 정리
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            modelRef.current?.dispose();
            modelRef.current = null;
        };
    }, []);

    const startCamera = async () => {
        setStatus("loading");
        setError("");

        try {
            if (!modelRef.current) {
                modelRef.current = await cocoSsd.load();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 },
                audio: false,
            });

            streamRef.current = stream;

            const video = videoRef.current;

            if (!video) {
                return;
            }

            video.srcObject = stream;
            video.onloadedmetadata = () => {
                void video.play();
                setPersonDetected(true);
                setStatus("ready");
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : "웹캠 또는 모델 로드에 실패했습니다.");
            setStatus("error");
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        setPersonDetected(true);
        setAbsenceSeconds(null);
        setStatus("off");
    };

    // 실시간 사람 감지 루프
    useEffect(() => {
        const model = modelRef.current;
        const video = videoRef.current;

        if (status !== "ready" || !model || !video) {
            return;
        }

        let cancelled = false;

        const detectFrame = async () => {
            if (cancelled) {
                return;
            }

            try {
                const detections = await model.detect(video, 20, PERSON_SCORE_THRESHOLD);
                const hasPerson = detections.some(
                    (detection) =>
                        detection.class === "person" && detection.score >= PERSON_SCORE_THRESHOLD
                );

                if (!cancelled) {
                    setPersonDetected(hasPerson);
                }
            } catch {
                // 프레임 단위 감지 실패는 무시하고 다음 프레임에서 재시도
            }

            if (!cancelled) {
                rafRef.current = requestAnimationFrame(detectFrame);
            }
        };

        rafRef.current = requestAnimationFrame(detectFrame);

        return () => {
            cancelled = true;

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [status]);

    // 사람이 감지되지 않는 상태로 10초가 지나면 타이머 일시정지 콜백 호출
    useEffect(() => {
        if (personDetected || !isTimerRunning || status !== "ready") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAbsenceSeconds(null);
            return;
        }

        let remaining = ABSENCE_TIMEOUT_SECONDS;
        setAbsenceSeconds(remaining);

        const intervalId = window.setInterval(() => {
            remaining -= 1;

            if (remaining <= 0) {
                window.clearInterval(intervalId);
                setAbsenceSeconds(null);
                onAbsenceTimeoutRef.current();
                stopCamera();
                setShowTimeoutDialog(true);
                return;
            }

            setAbsenceSeconds(remaining);
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [personDetected, isTimerRunning, status]);

    const isAbsenceWarning = status === "ready" && absenceSeconds !== null;

    return (
        <div className="w-full max-w-96">
            <div className="flex items-center justify-end gap-2 px-1">
                <button
                    type="button"
                    onClick={onOpenLaps}
                    aria-label="내 랩 목록 조회"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500"
                >
                    <History className="h-3.5 w-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (status === "ready") {
                            stopCamera();
                            return;
                        }

                        if (status !== "loading") {
                            void startCamera();
                        }
                    }}
                    disabled={status === "loading"}
                    aria-label={status === "ready" ? "캠 끄기" : "캠 켜기"}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500 disabled:cursor-wait disabled:opacity-60"
                >
                    {status === "ready" ? (
                        <VideoOff className="h-3.5 w-3.5" />
                    ) : (
                        <Video className="h-3.5 w-3.5" />
                    )}
                </button>
            </div>

            <div
                className={`relative mt-2 aspect-video overflow-hidden rounded-2xl border-2 bg-slate-900 shadow-sm ${
                    isAbsenceWarning ? "border-rose-500" : "border-orange-400"
                }`}
            >
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    className={`h-full w-full scale-x-[-1] object-cover ${
                        status === "ready" ? "" : "hidden"
                    }`}
                />

                {status !== "ready" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <VideoOff className="h-8 w-8" />
                        <p className="text-center text-xs font-bold">
                            {status === "loading"
                                ? "카메라 준비 중..."
                                : status === "error"
                                    ? error || "카메라를 켤 수 없습니다."
                                    : "캠이 꺼져 있습니다."}
                        </p>
                    </div>
                )}

                {status === "ready" && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white">
                        {isTimerRunning ? (
                            <>
                                <BookOpen className="h-3 w-3 text-indigo-300" />
                                공부 중
                            </>
                        ) : (
                            <>
                                <Coffee className="h-3 w-3 text-amber-300" />
                                쉬는 중
                            </>
                        )}
                    </div>
                )}

                <div className="absolute right-3 top-3">
                    <HoverCard openDelay={100}>
                        <HoverCardTrigger asChild>
                            <button
                                type="button"
                                aria-label="자동 일시정지 안내"
                                className="flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-black/50 text-[11px] font-black text-white"
                            >
                                ?
                            </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="text-xs font-bold text-slate-600">
                            캠에서 사람이 감지되지 않으면 10초 뒤 타이머가 자동으로 일시정지돼요.
                        </HoverCardContent>
                    </HoverCard>
                </div>

                {isAbsenceWarning && (
                    <div className="absolute inset-x-0 bottom-0 bg-rose-500/90 px-2 py-1.5 text-center text-[11px] font-bold text-white">
                        이탈이 감지되었습니다. {absenceSeconds}초 뒤에 타이머가 일시정지됩니다.
                    </div>
                )}
            </div>

            <Dialog open={showTimeoutDialog} onOpenChange={setShowTimeoutDialog}>
                <DialogContent showCloseButton={false} className="sm:max-w-sm">
                    <DialogHeader className="items-center text-center">
                        <DialogTitle>타이머가 일시정지되었습니다</DialogTitle>
                        <DialogDescription className="text-center whitespace-pre-line">
                            {"이탈 감지 후 10초가 지나 타이머가\n자동으로 일시정지되었습니다."}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="justify-center sm:justify-center">
                        <Button
                            type="button"
                            onClick={() => setShowTimeoutDialog(false)}
                            className="bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                            확인
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
