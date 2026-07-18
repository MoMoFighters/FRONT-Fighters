'use client'

import { useEffect, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createReviewAction } from "@/features/lecture/action";
import { useReviewSentimentModel } from "@/features/lecture/hooks/useReviewSentimentModel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CreateReviewBtnProps {
    lectureId: number;
    disabled?: boolean;
}

interface ReviewNotice {
    type: "positive-low" | "negative-high";
    rating: number;
}

export default function CreateReviewBtn({
    lectureId,
    disabled = false,
}: CreateReviewBtnProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const aiCheck = useReviewSentimentModel();
    const [notice, setNotice] = useState<ReviewNotice | null>(null);
    const [noticeShown, setNoticeShown] = useState(false);
    // 등록 버튼을 눌러서 실제로 분석을 기다리는 중인지 (모델 로딩 대기 포함)
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 별점/내용을 다시 고치면 화면에 남은 안내 문구만 지운다 (noticeShown은 유지)
    useEffect(() => {
        setNotice(null);
    }, [rating, content]);

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast.error("수강평 내용을 입력해주세요.");
            return;
        }

        if (aiCheck.enabled && !noticeShown) {
            setIsAnalyzing(true);
            try {
                // 모델이 아직 다운로드 중이면 analyze 내부에서 완료될 때까지 기다린다
                const predictedStar = await aiCheck.analyze(content);

                if (predictedStar !== null && Math.abs(predictedStar - rating) >= 2) {
                    setNotice({
                        type: predictedStar > rating ? "positive-low" : "negative-high",
                        rating,
                    });
                    setNoticeShown(true);
                    return;
                }
            } catch {
                // 분석 중 에러가 나도 등록은 그대로 진행한다
            } finally {
                setIsAnalyzing(false);
            }
        }

        startTransition(async () => {
            try {
                await createReviewAction(String(lectureId), {
                    rating,
                    content: content,
                });

                toast.success("수강평이 등록되었습니다. (+30p)");
                setOpen(false);
                setRating(5);
                setContent("");
                setNotice(null);
                setNoticeShown(false);
                router.refresh();
            } catch (error) {
                const message = error instanceof Error
                    ? error.message.split("|")[1]
                    : undefined;

                toast.error(message || "수강평 등록에 실패했습니다.");
            }
        });
    };

    const submitLabel = isPending
        ? "등록 중"
        : isAnalyzing
            ? (aiCheck.isLoading ? `모델 설치 중 ${aiCheck.progress}%` : "AI 검토 중...")
            : noticeShown
                ? "이대로 등록하기"
                : "등록";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={disabled}
                    className="h-9 cursor-pointer rounded-xl bg-indigo-500 px-4 text-sm font-bold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200"
                >
                    수강평 등록
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <div className="flex items-center gap-2 pr-8">
                    <Switch
                        checked={aiCheck.enabled}
                        onCheckedChange={aiCheck.toggle}
                        aria-label="AI 검토 모드"
                    />
                    <span className="text-xs font-medium text-slate-600">AI 검토 모드</span>
                </div>

                <DialogHeader>
                    <DialogTitle>수강평 등록하기</DialogTitle>
                    <DialogDescription>
                        강의에 대한 별점과 수강평을 남겨주세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-sm font-bold text-slate-700">별점</p>
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, index) => {
                                const value = index + 1;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setRating(value)}
                                        className="cursor-pointer rounded-md p-1 transition hover:bg-amber-50"
                                        aria-label={`${value}점`}
                                    >
                                        <Star
                                            className={`h-7 w-7 ${value <= rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="review-content"
                            className="mb-2 block text-sm font-bold text-slate-700"
                        >
                            내용
                        </label>
                        <textarea
                            id="review-content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="수강평을 입력해주세요."
                            className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {notice && (
                        <div className="rounded-xl border border-green-100 bg-green-50 px-3.5 py-2.5">
                            <p className="whitespace-pre-line text-xs leading-relaxed text-green-700">
                                {notice.type === "positive-low"
                                    ? `작성해주신 후기는 긍정적인 내용으로 보이는데, 별점은 ${notice.rating}점이에요. \n 혹시 별점을 잘못 선택하신 건 아닌지 확인해주세요!😊`
                                    : `작성해주신 후기는 다소 아쉬운 점이 느껴지는데, 별점은 ${notice.rating}점이에요. \n 혹시 별점을 잘못 선택하신 건 아닌지 확인해주세요!😊`}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                                AI 분석 결과는 정확하지 않을 수 있어요!
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        취소
                    </Button>
                    <Button
                        type="button"
                        className="cursor-pointer bg-indigo-500 text-white hover:bg-indigo-600"
                        onClick={handleSubmit}
                        disabled={isPending || isAnalyzing}
                    >
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
