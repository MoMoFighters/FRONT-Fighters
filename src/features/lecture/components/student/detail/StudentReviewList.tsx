import { Review } from "@/features/lecture/type";
import { SearchX, Star } from "lucide-react";

interface StudentReviewListProps {
    reviews: Review[];
}

export default function StudentReviewList({
    reviews,
}: StudentReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="flex h-72 flex-col items-center justify-center gap-4 text-slate-400">
                <SearchX className="h-12 w-12" />

                <p className="text-lg font-bold">
                    해당 강의에 대한 수강평이 존재하지 않습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {reviews.map((review) => (
                <article key={review.reviewId} className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-500">
                            {review.nickname.slice(0, 1)}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-bold text-slate-950">
                                    {review.nickname}
                                </p>

                                <span className="text-xs font-medium text-slate-400">
                                    {review.createdAt}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <Star
                                        key={index}
                                        className={`
                                            h-4 w-4
                                            ${index < review.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300"
                                            }
                                        `}
                                    />
                                ))}
                            </div>

                            <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                                {review.content}
                            </p>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
