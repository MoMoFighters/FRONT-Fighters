import { Review } from "@/app/admin/lectures/[lectureId]/page";
import { Star } from "lucide-react";

export default function ReviewItem({ review }: { review: Review }) {
    return (
        <div className="p-4 border border-slate-200 rounded-lg mb-4">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-2xl hrink-0">
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-slate-900 font-semibold text-md">{review.name}</span>
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