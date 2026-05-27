'use client'

import { Chapter, Review } from "@/app/admin/lectures/[lectureId]/page";
import ChapterItem from "@/components/common/ChapterItem";
import ReviewItem from "@/components/common/ReviewItem";
import { useSearchParams } from "next/navigation";

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
            {!searchStatus && chapters.map((chapter) => <ChapterItem role={role} key={chapter.id} isEnrolled={isEnrolled} chapter={chapter} />)}

            {searchStatus === "reviews" && reviews.map((review) => <ReviewItem key={review.id} review={review} />)}
        </>
    );
}