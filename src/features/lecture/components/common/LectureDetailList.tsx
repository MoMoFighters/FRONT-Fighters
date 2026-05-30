'use client'

import { Review } from "@/app/admin/lectures/[lectureId]/page";
import ChapterItem from "@/components/common/ChapterItem";
import ReviewItem from "@/components/common/ReviewItem";
import { SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Chapter } from "../../type";

interface LectureDetailListProps {
    chapters: Chapter[];
    reviews: Review[];
    isEnrolled?: boolean;
    role: string;
}

export default function LectureDetailList({ chapters, reviews, isEnrolled, role }: LectureDetailListProps) {

    const searchParams = useSearchParams();

    const searchStatus = searchParams.get("tab");

    return (
        <>
            {!searchStatus && chapters.map((chapter) => <ChapterItem role={role} key={chapter.chapterId} isEnrolled={isEnrolled} chapter={chapter} />)}

            {searchStatus === "reviews" && reviews.map((review) => <ReviewItem key={review.id} review={review} />)}

            {searchStatus === "reviews" && reviews.length === 0 && (
                <div className="h-full my-10 flex flex-col gap-2 justify-center items-center text-slate-400 text-md font-mediaum">
                    <SearchX className="w-8 h-8 text-slate-300"
                    />
                    해당 강의에 대한 수강평이 존재하지 않습니다.
                </div>
            )}
        </>
    );
}