"use client";

import { useCallback, useState } from "react";
import { getAllReviewsForSummaryAction } from "@/features/lecture/action";
import { useModelDownloadProgress } from "@/features/lecture/hooks/useModelDownloadProgress";
import type { Review } from "@/features/lecture/type";

// v2: 대표 수강평이 단수(representativeReview)에서 배열(representativeReviews)로 바뀌어
// 예전 구조로 저장된 캐시를 그대로 신뢰하면 화면에서 깨지므로 캐시 키 자체를 새로 분리한다.
const CACHE_KEY_PREFIX = "momocity-review-summary-v2-";

export interface ReviewSummaryResult {
    representativeReviews: Review[];
    averageRating: number;
}

interface CachedSummary {
    reviewCount: number;
    result: ReviewSummaryResult;
}

type SummaryPhase = "idle" | "loading-model" | "analyzing" | "done" | "error";

type Embedder = (
    text: string,
    options: { pooling: "mean"; normalize: boolean }
) => Promise<{ data: Float32Array }>;

// 코사인 유사도 계산 함수 (내적 / (크기 × 크기))
function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function useReviewSummaryModel() {
    const [phase, setPhase] = useState<SummaryPhase>("idle");
    const {
        progress: modelProgress,
        isFinalizing,
        hasTimedOut,
        dismissTimeout,
        handleProgressEvent,
        reset: resetModelProgress,
        complete: completeModelProgress,
    } = useModelDownloadProgress();
    const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: 0 });
    const [result, setResult] = useState<ReviewSummaryResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const summarize = useCallback(async (lectureId: string, reviewCount: number) => {
        setError(null);

        const cacheKey = `${CACHE_KEY_PREFIX}${lectureId}`;

        try {
            const cachedRaw = window.localStorage.getItem(cacheKey);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw) as CachedSummary;
                if (cached.reviewCount === reviewCount) {
                    setResult(cached.result);
                    setPhase("done");
                    return;
                }
            }
        } catch {
            // 캐시 파싱 실패는 무시하고 새로 계산한다
        }

        setPhase("loading-model");
        resetModelProgress();

        try {
            // 1. 전체 수강평을 서버 액션으로 가져온다
            const reviews = await getAllReviewsForSummaryAction(lectureId);

            if (reviews.length === 0) {
                throw new Error("분석할 수강평이 없습니다.");
            }

            // 2. 임베딩 모델 로드 (feature-extraction, mean pooling + normalize)
            const { pipeline } = await import("@huggingface/transformers");
            const extractor = (await pipeline(
                "feature-extraction",
                "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
                {
                    progress_callback: handleProgressEvent,
                }
            )) as unknown as Embedder;

            completeModelProgress();
            setPhase("analyzing");
            setAnalyzeProgress({ current: 0, total: reviews.length });

            // 3. 모든 수강평을 벡터로 변환 (진행 개수를 함께 갱신)
            const embeddings: number[][] = [];
            for (let i = 0; i < reviews.length; i++) {
                const output = await extractor(reviews[i].content, {
                    pooling: "mean",
                    normalize: true,
                });
                embeddings.push(Array.from(output.data));
                setAnalyzeProgress({ current: i + 1, total: reviews.length });
            }

            // 4. 중심(centroid) 벡터 계산 — 좌표별 평균
            const dimension = embeddings[0].length;
            const centroid = new Array(dimension).fill(0);
            for (const vector of embeddings) {
                for (let i = 0; i < dimension; i++) {
                    centroid[i] += vector[i] / embeddings.length;
                }
            }

            // 5. 중심과 유사도가 높은 순으로 정렬해 상위 3개(또는 그 이하) 실제 수강평 선정
            const ranked = embeddings
                .map((vector, index) => ({ index, score: cosineSimilarity(vector, centroid) }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 3);

            const averageRating =
                reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

            const summary: ReviewSummaryResult = {
                representativeReviews: ranked.map(({ index }) => reviews[index]),
                averageRating,
            };

            setResult(summary);
            setPhase("done");

            // 6. 강의ID + 리뷰 개수를 키로 결과를 캐싱해서 리뷰 수가 그대로면 재계산을 건너뛴다
            window.localStorage.setItem(
                cacheKey,
                JSON.stringify({ reviewCount, result: summary } satisfies CachedSummary)
            );
        } catch {
            setError("수강평을 요약하는 중 문제가 발생했어요.");
            setPhase("error");
        }
    }, [handleProgressEvent, resetModelProgress, completeModelProgress]);

    return {
        phase,
        modelProgress,
        isFinalizing,
        hasTimedOut,
        dismissTimeout,
        analyzeProgress,
        result,
        error,
        summarize,
    };
}
