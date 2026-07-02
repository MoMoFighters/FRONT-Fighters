'use client'

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createReviewAction } from "@/features/lecture/action";
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

export default function CreateReviewBtn({
    lectureId,
    disabled = false,
}: CreateReviewBtnProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = () => {
        if (!content.trim()) {
            toast.error("수강평 내용을 입력해주세요.");
            return;
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
                router.refresh();
            } catch (error) {
                const message = error instanceof Error
                    ? error.message.split("|")[1]
                    : undefined;

                toast.error(message || "수강평 등록에 실패했습니다.");
            }
        });
    };

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
                        disabled={isPending}
                    >
                        {isPending ? "등록 중" : "등록"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
