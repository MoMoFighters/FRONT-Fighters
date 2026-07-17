"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TOGGLE_STORAGE_KEY = "momocity-review-ai-check-enabled";

interface SentimentResult {
    label: string;
    score: number;
}

type Classifier = (text: string) => Promise<SentimentResult[]>;

export function useReviewSentimentModel() {
    const [enabled, setEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const classifierRef = useRef<Classifier | null>(null);
    // 진행 중인 로딩 Promise를 저장해서, 로딩 중에 analyze가 호출되면
    // 새로 로드를 시작하지 않고 이 Promise가 끝날 때까지 기다리게 한다
    const loadPromiseRef = useRef<Promise<Classifier> | null>(null);

    const loadModel = useCallback((): Promise<Classifier> => {
        if (classifierRef.current) {
            return Promise.resolve(classifierRef.current);
        }

        if (loadPromiseRef.current) {
            return loadPromiseRef.current;
        }

        setIsLoading(true);
        setProgress(0);

        const promise = (async () => {
            try {
                const { pipeline } = await import("@huggingface/transformers");
                const classifier = (await pipeline(
                    "text-classification",
                    "Xenova/bert-base-multilingual-uncased-sentiment",
                    {
                        dtype: "q8",
                        progress_callback: (data: { status: string; progress?: number }) => {
                            if (data.status === "progress" && typeof data.progress === "number") {
                                setProgress(Math.round(data.progress));
                            }
                        },
                    }
                )) as unknown as Classifier;

                classifierRef.current = classifier;
                return classifier;
            } catch (error) {
                // 모델 로드 실패 시 토글을 조용히 끄고 일반 등록으로 폴백한다
                loadPromiseRef.current = null;
                setEnabled(false);
                window.localStorage.setItem(TOGGLE_STORAGE_KEY, "false");
                throw error;
            } finally {
                setIsLoading(false);
            }
        })();

        loadPromiseRef.current = promise;
        return promise;
    }, []);

    // 재방문 시 저장된 토글 상태를 복원하고, ON이었다면 모델을 바로 예열한다
    useEffect(() => {
        const stored = window.localStorage.getItem(TOGGLE_STORAGE_KEY);
        if (stored === "true") {
            setEnabled(true);
            void loadModel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = useCallback(
        (next: boolean) => {
            setEnabled(next);
            window.localStorage.setItem(TOGGLE_STORAGE_KEY, String(next));
            if (next) void loadModel();
        },
        [loadModel]
    );

    // 모델이 아직 로딩 중이면 완료될 때까지 기다렸다가 분석한다 (로딩 중이라고 건너뛰지 않음)
    const analyze = useCallback(
        async (text: string): Promise<number | null> => {
            try {
                const classifier = await loadModel();
                const result = await classifier(text);
                const label = result[0]?.label ?? "";
                const parsed = parseInt(label, 10);
                return Number.isNaN(parsed) ? null : parsed;
            } catch {
                return null;
            }
        },
        [loadModel]
    );

    return { enabled, toggle, isLoading, progress, analyze };
}
