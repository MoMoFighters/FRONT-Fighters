"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

import { STUDY_PHRASES } from "@/features/study/phraseData";

const QUOTE_ROTATE_INTERVAL_MS = 30000;
const FADE_TRANSITION_MS = 300;

const pickRandomPhrase = (exclude?: string): string => {
    if (STUDY_PHRASES.length <= 1) {
        return STUDY_PHRASES[0] ?? "";
    }

    let next: string;

    do {
        next = STUDY_PHRASES[Math.floor(Math.random() * STUDY_PHRASES.length)];
    } while (next === exclude);

    return next;
};

export default function StudyQuoteCard() {
    // 서버/클라이언트 첫 렌더가 일치하도록 초기값은 고정하고, 마운트 이후에만 랜덤으로 교체한다.
    const [phrase, setPhrase] = useState(STUDY_PHRASES[0] ?? "");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let fadeTimeoutId: number | undefined;

        const rotate = () => {
            setIsVisible(false);

            fadeTimeoutId = window.setTimeout(() => {
                setPhrase((prev) => pickRandomPhrase(prev));
                setIsVisible(true);
            }, FADE_TRANSITION_MS);
        };

        rotate();

        const intervalId = window.setInterval(rotate, QUOTE_ROTATE_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);

            if (fadeTimeoutId !== undefined) {
                window.clearTimeout(fadeTimeoutId);
            }
        };
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-2">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                <p
                    className={`text-sm font-bold leading-relaxed text-slate-700 transition-all duration-300 ease-out ${
                        isVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                    }`}
                >
                    {phrase}
                </p>
            </div>
        </div>
    );
}
