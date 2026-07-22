"use client";

import { useEffect, useState } from "react";
import { Square, Volume2 } from "lucide-react";

interface TTSTriggerButtonProps {
    text: string;
}

const SPEECH_RATE = 1.2;
const VOICE_INDEX = 12;

// TTS가 마크다운 특수문자(**, #, -, [](), ` 등)를 그대로 읽어버리는 문제를 막기 위해 순수 텍스트로 변환
function stripMarkdown(markdown: string): string {
    return markdown
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/^>\s?/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "")
        .replace(/^-{3,}$/gm, "")
        .replace(/\s+/g, " ")
        .trim();
}

export default function TTSTriggerButton({ text }: TTSTriggerButtonProps) {
    const [hasTTSSupport, setHasTTSSupport] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        setHasTTSSupport(true);

        // 크롬은 보이스 목록을 비동기로 불러와서, voiceschanged 이벤트로 목록이 준비된 뒤 다시 골라야 한다
        const pickVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            setVoice(voices[VOICE_INDEX] ?? voices[0] ?? null);
        };

        pickVoice();
        window.speechSynthesis.addEventListener("voiceschanged", pickVoice);

        return () => {
            window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
        };
    }, []);

    const handleSpeak = () => {
        if (!hasTTSSupport) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(stripMarkdown(text));

        utterance.lang = "ko-KR";
        utterance.rate = SPEECH_RATE;
        if (voice) {
            utterance.voice = voice;
        }
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.cancel();
        synth.speak(utterance);
    };

    const handleStop = () => {
        if (!hasTTSSupport) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="flex items-center gap-1">
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

            {isSpeaking && (
                <div className="group/tts-stop relative flex items-center">
                    <button
                        type="button"
                        onClick={handleStop}
                        aria-label="음성 출력 정지"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:text-slate-600"
                    >
                        <Square className="h-2.5 w-2.5 fill-current" />
                    </button>

                    <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[11px] text-white opacity-0 shadow-lg transition-opacity group-hover/tts-stop:opacity-100">
                        음성 출력 정지
                    </span>
                </div>
            )}
        </div>
    );
}
