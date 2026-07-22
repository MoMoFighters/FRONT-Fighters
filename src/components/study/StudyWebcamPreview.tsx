"use client";

import { useEffect, useRef, useState } from "react";
import { VideoOff } from "lucide-react";

type CameraStatus = "loading" | "granted" | "denied";

export default function StudyWebcamPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [status, setStatus] = useState<CameraStatus>("loading");

    useEffect(() => {
        let cancelled = false;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setStatus("granted");
            } catch {
                if (!cancelled) {
                    setStatus("denied");
                }
            }
        };

        void startCamera();

        return () => {
            cancelled = true;
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <div className="w-full max-w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-900">내 캠</p>

            <div className="relative mt-3 aspect-video overflow-hidden rounded-xl bg-slate-900">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`h-full w-full scale-x-[-1] object-cover ${
                        status === "granted" ? "" : "hidden"
                    }`}
                />

                {status !== "granted" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <VideoOff className="h-6 w-6" />
                        <p className="text-center text-xs font-bold">
                            {status === "loading"
                                ? "카메라 준비 중..."
                                : "카메라 권한이 필요합니다."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
