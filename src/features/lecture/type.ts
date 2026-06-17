// DB 기준 카테고리 ENUM 타입 - API 통신 간에 필요한 타입
export type Category = "STUDY" | "FITNESS" | "COOK" | "BEAUTY" | "ART";

// 실제 개발 중 사용할 카테고리 ENUM 타입 - url 표시 등등
export type LowerCategory = "study" | "fitness" | "cook" | "beauty" | "art";

// DB 기준 강의 상태 ENUM 타입 - API 통신 간에 필요한 타입
export type LectureStatus = "WAITING" | "ACTIVE" | "HOLD" | "DELETE";

// 강의 전체 조회 타입 정의
export interface LectureList {
    lectureId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    lectureStatus: LectureStatus;
    averageRating: number;
    reviewCount: number;
    chapterCount: number;
    createdAt: string;
    updatedAt: string;

    //수강 중인 학생의 경우
    isEnrolled?: boolean;
    isCompleted?: boolean;
    totalProgress?: number;
}

export interface LectureListRequest {
    category?: Category;
    keyword?: string;
    status?: string;
    enrolled?: boolean;
    page?: number;
}

export interface LectureListResponse {
    content: LectureList[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// 강의 상세 조회 타입 정의
export interface LectureDetail {
    lectureId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    lectureStatus: LectureStatus;
    averageRating: number;
    chapters: Chapter[];
    reviews: Review[];
    createdAt: string;
    updatedAt: string;

    //수강 중인 학생의 경우
    isEnrolled?: boolean;
    isCompleted?: boolean;
    totalProgress?: number;

    // 수강평 페이지네이션 데이터
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface Chapter {
    chapterId: number;
    orderNo: number;
    title: string;
    durationSec: number;
    thumbnailUrl: string;

    // 수강 중인 학생의 경우
    isCompleted?: boolean;
    isAccessible?: boolean;
    totalProgress?: number;
}

export interface Review {
    reviewId: number;
    userId: number;
    userName: string;
    profileImgUrl: string;
    content: string;
    rating: number;
    createdAt: string;
}



export interface StatusRequest {
    lectureStatus: LectureStatus;
}

export type StatusApiUrl = LectureStatus;

export interface UpdateVideoProgressRequest {
    playbackSeconds: number;
}

export interface UpdateVideoProgressByExitRequest {
    playbackSeconds: number;
    lastPositionSec: number;
}

export interface UpdateVideoProgressResponse {
    chapterId: number;
    watchedSeconds: number;
    progressRate: number;
    isCompleted: boolean;
    totalProgress: number;
    completedCount: number;
}

export interface ResumeResponse {
    lectureId: number;
    chapterId: number;
    chapterTitle: string;
    lastPositionSec: number;
    durationSec: number;
    totalProgress: number;
}

export interface LectureMetaResponse {
    lectureId: number;
    lectureTitle: string;
    thumbnailUrl: string | null;
    totalChapterCount: number;
    currentChapterId: number;
    currentChapterNo: number;
    currentChapterTitle: string;
    chapters: Chapter[];
}

export interface LectureEnrollResponse {
    enrollmentId: number;
    lectureId: number;
    userId: number;
    totalProgress: number;
    completedCount: number;
    enrolledAt: string;
}

export interface EnrollLectureResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: LectureEnrollResponse | null;
}



// 에러 방지를 위한
export interface LectureProgress {
    totalProgress: number;
    completedCount: number;
    totalChapterCount: number;
}

export type ChapterProgress = Chapter;
