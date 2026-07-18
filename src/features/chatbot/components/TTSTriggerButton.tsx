"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

interface TTSTriggerButtonProps {
    text: string;
}

export default function TTSTriggerButton({ text }: TTSTriggerButtonProps) {
    const [hasTTSSupport, setHasTTSSupport] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        setHasTTSSupport(typeof window !== "undefined" && "speechSynthesis" in window);
    }, []);

    const handleSpeak = () => {
        if (!hasTTSSupport) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "ko-KR";
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.cancel();
        synth.speak(utterance);
    };

    return (
        <div className="group/tts relative flex items-center">
            <button
                type="button"
                onClick={handleSpeak}
                disabled={!hasTTSSupport}
                aria-label="음성 인식 출력"
                className={`flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white transition ${
                    isSpeaking ? "text-indigo-500" : "text-slate-400 hover:text-slate-600"
                } disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Volume2 className="h-3.5 w-3.5" />
            </button>

            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover/tts:opacity-100">
                음성 인식 출력
            </span>
        </div>
    );
}
