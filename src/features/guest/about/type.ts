export type AboutTab = "all" | "student" | "teacher";

export type FaqAudience = "COMMON" | "STUDENT" | "TEACHER";

export interface AboutFaqItem {
    id: string;
    audience: FaqAudience;
    question: string;
    answer: string;
    /** 답변에 함께 보여줄 이미지 경로 (선택). 준비되면 넣어주세요. */
    imageSrc?: string;
}
