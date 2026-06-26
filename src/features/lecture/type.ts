// 카테고리 ENUM 타입 -> 백엔드 ENUM 값에 맞춰 대문자로 사용
export type Category = "STUDY" | "FITNESS" | "COOK" | "BEAUTY" | "ART";

// 강의 상태 ENUM 타입 
export type LectureStatus = "WAITING" | "ACTIVE" | "HOLD" | "DELETE";

// 강의 전체 조회 타입 정의
export interface Lecture {
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
    lectureProgress?: number;
}

export interface LectureListRequest {
    category?: Category;
    keyword?: string;
    status?: string;
    enrolled?: boolean;
    page?: number;
}

export interface LectureListResponse {
    content: Lecture[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// 강의 상세 조회 타입 정의
export interface LectureDetailResponse {
    lectureId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    lectureStatus: LectureStatus;
    averageRating: number;
    reviewCount: number;
    chapters: Chapter[];
    createdAt: string;
    updatedAt: string;

    //수강 중인 학생의 경우
    isEnrolled?: boolean;
    isCompleted?: boolean;
    lectureProgress?: number;
}

export interface Chapter {
    chapterId: number;
    orderNo: number;
    title: string;
    durationSec: number;

    // api 가능하면
    thumbnailUrl?: string;

    // 수강 중인 학생의 경우
    isCompleted?: boolean;
    isAccessible?: boolean;
    chapterProgress?: number;
}

// 수강평 목록 조회 타입 정의
export interface Review {
    reviewId: number;
    userId: number;
    nickname: string;
    profileImageUrl: string;
    content: string;
    rating: number;
    createdAt: string;
}

export interface ReviewResponse {
    content: Review[]
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface CreateReviewRequest {
    rating: number;
    content: string;
}

// 카테고리 별 강의 진척도 및 이어보기 데이터 조회 타입 정의 -> 강의 관련 페이지 오른쪽 사이드 카드 데이터
export interface AsideCardInfoResponse {
    // 내 강의 총 진척도 -> 마이페이지 내 강의 조회 시에만
    MyTotalProgress?: number;

    // 특정 카테고리 강의 목록 조회 시에만
    // 1. 카테고리별 총 진척도 -> 나의 학습 현황
    progressByCategory?: number;

    // 2. 건물 정보
    buildingLevel?: number;
    buildingCurrentExp?: number;
    buildingTotalExp?: number;
    buildingUrl?: string;
}

export interface LatestChapterInfoResponse {
    lectureId: number;
    lectureTitle: string;
    chapterId: number;
    chapterTitle: string;
    chapterProgress: number;
    // api 수정에서 반드시 받아오게 될 예정
    chapterThumbnailUrl?: string;
}

// 강의 메타 데이터 조회 타입 정의 -> 챕터 상세 조회 시
export interface LectureMetaResponse {
    lectureId: number;
    lectureTitle: string;
    totalChapterCount: number;
    currentChapterId: number;
    currentChapterNo: number;
    currentChapterTitle: string;
    chapters: Chapter[];
}

// 챕터 이어보기 영상 재생 타입 정의 -> 영상 시청을 위한 url과 이어볼 재생 위치
export interface VideoPlayerResponse {
    presignedUrl: string;
    expiresIn: number,
    lastPositionSec: number;
}

/* ****************수정 필요**************** */


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



