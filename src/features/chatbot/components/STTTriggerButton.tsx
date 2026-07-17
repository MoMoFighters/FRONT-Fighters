"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface STTTriggerButtonProps {
    onResult: (text: string) => void;
    disabled?: boolean;
}

export default function STTTriggerButton({ onResult, disabled = false }: STTTriggerButtonProps) {
    const [hasSTTSupport, setHasSTTSupport] = useState(false);
    const { finalTranscript, listening, browserSupportsSpeechRecognition, resetTranscript } =
        useSpeechRecognition();

    useEffect(() => {
        setHasSTTSupport(browserSupportsSpeechRecognition);
    }, [browserSupportsSpeechRecognition]);

    useEffect(() => {
        if (finalTranscript) {
            onResult(finalTranscript);
            resetTranscript();
        }
    }, [finalTranscript, onResult, resetTranscript]);

    const toggleListening = () => {
        if (!hasSTTSupport || disabled) return;

        if (listening) {
            SpeechRecognition.stopListening();
            return;
        }

        // continuous: false → 말을 멈추고 무음이 감지되면 브라우저가 자동으로 인식을 종료하고
        // finalTranscript를 확정한다 (수동으로 다시 눌러 끄지 않아도 됨)
        SpeechRecognition.startListening({ language: "ko-KR", continuous: false, interimResults: true });
    };

    return (
        <div className="group/stt relative flex items-center gap-1.5">
            {listening && (
                <span className="flex items-end gap-0.5" aria-hidden="true">
                    <span className="h-2 w-0.5 animate-stt-wave rounded-full bg-indigo-400 [animation-delay:0ms]" />
                    <span className="h-3 w-0.5 animate-stt-wave rounded-full bg-indigo-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-0.5 animate-stt-wave rounded-full bg-indigo-400 [animation-delay:300ms]" />
                    <span className="h-2.5 w-0.5 animate-stt-wave rounded-full bg-indigo-400 [animation-delay:450ms]" />
                </span>
            )}

            <button
                type="button"
                onClick={toggleListening}
                disabled={!hasSTTSupport || disabled}
                aria-label={listening ? "음성 인식 중지" : "음성 인식 입력"}
                className={`relative flex h-7 w-7 items-center justify-center rounded-full transition ${
                    listening ? "bg-indigo-500 text-white" : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                } disabled:cursor-not-allowed disabled:opacity-40`}
            >
                {listening && <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-75" />}
                <Mic className="relative h-4 w-4" />
            </button>

            {/* 툴팁은 라이트 배경 위에서도 잘 보이도록 어두운 배경 유지 */}
            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover/stt:opacity-100">
                {listening ? "음성 인식 중지" : "음성 인식 입력"}
            </span>
        </div>
    );
}
