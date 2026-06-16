// DB 기준 카테고리 ENUM 타입 - API 통신 간에 필요한 타입
export type Category = "STUDY" | "FITNESS" | "COOK" | "BEAUTY" | "ART";

// 실제 개발 중 사용할 카테고리 ENUM 타입 - url 표시 등등
export type LowerCategory = "study" | "fitness" | "cook" | "beauty" | "art";

// DB 기준 강의 상태 ENUM 타입 - API 통신 간에 필요한 타입
export type LectureStatus = "WAITING" | "ACTIVE" | "HOLD" | "DELETE";

// 실제로 화면에서 필요한 강의의 타입 정의
export interface Lecture {
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
    isEnrolled?: boolean; //신청여부
    totalProgress?: number; //해당 학생이 이 강의를 얼만큼 들었는가 (%)
}

export interface LectureDetail {
    lectureId: number;

    teacherId?: number;
    teacherName?: string;

    title: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    averageRating: number;
    reviewCount: number;
    chapters: Chapter[];
    createdAt: string;
    updatedAt: string;

    // 관리자, 강사의 경우
    lectureStatus?: LectureStatus;

    //수강 중인 학생의 경우
    isEnrolled?: boolean; //신청여부
    totalProgress?: number; //해당 학생이 이 강의를 얼만큼 들었는가 (%)
}


export interface LectureList {
    lectureId: number;

    teacherId?: number;
    teacherName?: string;

    title: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    averageRating: number;
    reviewCount: number;
    // 총 챕터 수
    createdAt: string;
    updatedAt: string;

    // 관리자, 강사의 경우
    lectureStatus?: LectureStatus;

    //수강 중인 학생의 경우
    isEnrolled?: boolean; //신청여부
    totalProgress?: number; //해당 학생이 이 강의를 얼만큼 들었는가 (%)
}

export interface Chapter {
    chapterId: number;
    title: string;
    orderNo: number;
    durationSec: number;

    // 챕터 영상 시청 시 임시발급 url
    presignedUrl?: string;

    // videoStatus?: VideoStatus;
    // videoSizeBytes: number;
    // thumbnailUrl : string;


    // 수강 중인 학생의 경우
    isCompleted?: boolean;
    isAccessible?: boolean;

    // 영상을 볼때
    watchedSeconds?: number;
    lastPositionSec?: number;
    /*     아래 둘중 하나 날리셈     */
    totalProgress?: number;
    progressRate?: number;
}

export interface LectureProgress {
    totalProgress: number;
    completedCount: number;
    totalChapterCount: number;
}

export type ChapterProgress = Chapter;

export interface Review {
    id: number;
    lectureId: number;
    lectureTitle: string;
    authorId: number;
    authorName: string;
    rating: number;
    description: string;
    createdAt: string;
}


export interface LectureListResponse {
    content: Lecture[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}


// 강의 목록 조회에서 필요한 props 타입 정의 🍑request->payload로 이름변경
export interface GetLecturesPayload {
    category?: Category;
    keyword?: string;
    status?: string;
    enrolled?: boolean;
    page?: number;
}

export type GetLecturesRequest = GetLecturesPayload;

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