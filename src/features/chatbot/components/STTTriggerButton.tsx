"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface STTTriggerButtonProps {
    onResult: (text: string) => void;
}

export default function STTTriggerButton({ onResult }: STTTriggerButtonProps) {
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
        if (!hasSTTSupport) return;

        if (listening) {
            SpeechRecognition.stopListening();
            return;
        }

        SpeechRecognition.startListening({ language: "ko-KR", continuous: true, interimResults: true });
    };

    return (
        <div className="group/stt relative flex items-center">
            <button
                type="button"
                onClick={toggleListening}
                disabled={!hasSTTSupport}
                aria-label="음성 인식 입력"
                className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                    listening ? "bg-indigo-500 text-white" : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                } disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Mic className="h-4 w-4" />
            </button>

            {/* 툴팁은 라이트 배경 위에서도 잘 보이도록 어두운 배경 유지 */}
            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover/stt:opacity-100">
                음성 인식 입력
            </span>
        </div>
    );
}
