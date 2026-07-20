"use client";

import { useCallback, useState } from "react";
import { getAllReviewsForSummaryAction } from "@/features/lecture/action";
import type { Review } from "@/features/lecture/type";

const CACHE_KEY_PREFIX = "momocity-review-summary-";

export interface ReviewSummaryResult {
    representativeReview: Review;
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
    const [modelProgress, setModelProgress] = useState(0);
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
        setModelProgress(0);

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
                    progress_callback: (data: { status: string; progress?: number }) => {
                        if (data.status === "progress" && typeof data.progress === "number") {
                            setModelProgress(Math.round(data.progress));
                        }
                    },
                }
            )) as unknown as Embedder;

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

            // 5. 중심과 가장 유사한(코사인 유사도가 가장 높은) 실제 수강평 찾기
            let bestIndex = 0;
            let bestScore = -Infinity;

            embeddings.forEach((vector, index) => {
                const score = cosineSimilarity(vector, centroid);
                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = index;
                }
            });

            const averageRating =
                reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

            const summary: ReviewSummaryResult = {
                representativeReview: reviews[bestIndex],
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
    }, []);

    return { phase, modelProgress, analyzeProgress, result, error, summarize };
}
