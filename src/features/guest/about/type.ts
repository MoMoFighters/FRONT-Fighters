import type { StaticImageData } from "next/image";

export type AboutTab = "all" | "student" | "teacher";

export type FaqAudience = "COMMON" | "STUDENT" | "TEACHER";

export interface AboutFaqImage {
    src: string | StaticImageData;
    alt?: string;
}

export interface FaqTextBlock {
    type: "text";
    text: string;
}

export interface FaqImageBlock {
    type: "image";
    images: AboutFaqImage[];
}

/** 답변을 이루는 조각 하나. text/image 블록을 원하는 순서로 나열해서 "글-사진-글"을 만듭니다. */
export type FaqBlock = FaqTextBlock | FaqImageBlock;

export interface AboutFaqItem {
    id: string;
    audience: FaqAudience;
    question: string;
    /** 답변 본문. text()/image() 헬퍼로 블록을 순서대로 나열하세요. */
    content: FaqBlock[];
}

/** 글 블록 하나를 만듭니다. answer 문자열 안에 <Link href='...'>텍스트</Link>를 쓰면 실제 링크로 렌더링됩니다. */
export const text = (value: string): FaqTextBlock => ({
    type: "text",
    text: value,
});

/** 이미지 블록 하나를 만듭니다. 1장만 넘기면 통 사진, 2장 이상 넘기면 나란히(그리드) 배치됩니다. */
export const image = (...images: AboutFaqImage[]): FaqImageBlock => ({
    type: "image",
    images,
});
