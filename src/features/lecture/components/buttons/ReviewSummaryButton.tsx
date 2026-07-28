"use client";

import { useState } from "react";
import { AlertTriangle, Sparkles, Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useReviewSummaryModel } from "@/features/lecture/hooks/useReviewSummaryModel";
import OneButtonModal from "@/features/modal/OneButtonModal";

interface ReviewSummaryButtonProps {
    lectureId: string;
    reviewCount: number;
}

const MIN_REVIEW_COUNT = 5;

const MODEL_TIMEOUT_DESCRIPTION =
    "네트워크 상태에 따라 다운로드가 오래 걸리고 있어요.\n다운로드는 백그라운드에서 계속 진행되니,\n잠시 후 다시 시도해주시면 훨씬 빠르게 이용하실 수 있어요!";

export default function ReviewSummaryButton({ lectureId, reviewCount }: ReviewSummaryButtonProps) {
    const {
        phase,
        modelProgress,
        isFinalizing,
        hasTimedOut,
        dismissTimeout,
        analyzeProgress,
        result,
        error,
        summarize,
    } = useReviewSummaryModel();
    const [open, setOpen] = useState(false);

    if (reviewCount < MIN_REVIEW_COUNT) {
        return null;
    }

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (next && phase === "idle") {
            void summarize(lectureId, reviewCount);
        }
    };

    const isBusy = phase === "loading-model" || phase === "analyzing";
    const analyzePercent = Math.round(
        (analyzeProgress.current / Math.max(analyzeProgress.total, 1)) * 100
    );

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:from-indigo-100 hover:to-violet-100"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    수강평 요약
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                        AI 수강평 요약
                    </DialogTitle>
                    <DialogDescription>
                        전체 수강평을 분석해서 가장 대표적인 후기를 찾아드려요.
                    </DialogDescription>
                </DialogHeader>

                {isBusy && (
                    <div className="space-y-3 py-2">
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                            <span>
                                {phase === "loading-model"
                                    ? (isFinalizing
                                        ? "곧 다운로드가 끝납니다.. 조금만 기다려주세요!"
                                        : "AI 모델 다운로드 중...")
                                    : `수강평 분석 중... (${analyzeProgress.current}/${analyzeProgress.total})`}
                            </span>
                            {!(phase === "loading-model" && isFinalizing) && (
                                <span>{phase === "loading-model" ? `${modelProgress}%` : `${analyzePercent}%`}</span>
                            )}
                        </div>

                        <Progress value={phase === "loading-model" ? modelProgress : analyzePercent} />

                        <p className="text-center text-[11px] text-slate-400">
                            처음 한 번만 모델을 내려받으며, 이후엔 훨씬 빠르게 분석돼요.
                        </p>
                    </div>
                )}

                {phase === "error" && error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                {phase === "done" && result && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-1 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 py-4">
                            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                            <span className="text-2xl font-bold text-slate-800">
                                {result.averageRating.toFixed(1)}
                            </span>
                            <span className="text-sm font-medium text-slate-400">/ 5.0</span>
                        </div>

                        <p className="text-[11px] font-bold text-indigo-500">
                            전체 수강평의 경향을 가장 잘 담은 후기 {result.representativeReviews.length}개
                        </p>

                        <div className="space-y-2">
                            {result.representativeReviews.map((review) => (
                                <div
                                    key={review.reviewId}
                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                >
                                    <div className="mb-1.5 flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-slate-700">
                                            {review.nickname}
                                        </span>
                                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            {review.rating}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        &ldquo;{review.content}&rdquo;
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>

            <OneButtonModal
                open={hasTimedOut}
                onOpenChange={(next) => {
                    if (!next) dismissTimeout();
                }}
                title="모델 다운로드가 지연되고 있어요"
                description={MODEL_TIMEOUT_DESCRIPTION}
                onConfirm={dismissTimeout}
                contentClassName="data-[size=sm]:max-w-[320px]"
            />
        </Dialog>
    );
}
