import { Review } from "@/features/lecture/type";
import CreateReportBtn from "@/features/report/components/buttons/CreateReportBtn";
import { Star } from "lucide-react";

export default function ReviewItem({ review }: { review: Review }) {
    return (
        <div className="relative mb-4 rounded-lg border border-slate-200 p-4 pr-12">
            <CreateReportBtn
                triggerLabel="수강평 신고"
                triggerVariant="icon"
                triggerClassName="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                targetType="REVIEW"
                targetId={review.reviewId}
            />

            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-2xl hrink-0">
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-900 font-semibold text-md">{review.nickname}</span>
                        <span className="text-slate-500 text-sm">{review.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-slate-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-slate-600 text-sm truncate max-w-100">{review.content}</p>
                </div>
            </div>
        </div>
    );
}
