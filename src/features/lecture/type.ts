export type CategoryApiUrl =
    "STUDY" | "FITNESS" | "COOK" | "BEAUTY" | "ART";

export type CategoryUrl =
    "study" | "fitness" | "cook" | "beauty" | "art";

export type StatusApiUrl =
    "WAITING" | "ACTIVE" | "HOLD" | "DELETE";

// 실제로 화면에서 필요한 강의의 타입 정의

export interface Lecture {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: CategoryApiUrl;
    lectureStatus: string;
    averageRating: number;
    isEnrolled?: boolean;
}

export interface LectureProgress {
    totalProgress: number;
    completedCount: number;
    totalChapterCount: number;
}

export interface LectureDetail {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: CategoryApiUrl;
    lectureStatus: string;
    averageRating: number;
    chapters: Chapter[];
    isEnrolled?: boolean;
}

export interface Chapter {
    chapterId: number;
    lectureId: number;
    title: string;
    orderNo: number;
    videoUrl: string;
    videoSizeBytes: number;
    videoStatus: string;
    durationSec: number;
    originalFilename: string;

    progressRate?: number;
    watchedSeconds?: number;
    isCompleted?: boolean;

    isAccessible?: boolean;
}

export interface ChapterProgress {
    chapterId: number,
    title: string,
    orderNo: number,
    watchedSeconds: number,
    durationSec: number,
    progressRate: number,
    isCompleted: boolean,
    isAccessible?: boolean
}

export interface LectureListInfo {
    content: Lecture[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// 강의 목록 조회에서 필요한 props 타입 정의

export interface GetLecturesRequest {
    category?: CategoryApiUrl;
    keyword?: string;
    status?: string;
    enrolled?: boolean;
    page?: number;
}


// 강의 조회 응답값에 대한 types 정의

export interface LectureResponse {
    lectureId: number;
    teacherId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: CategoryApiUrl;
    lectureStatus: string;
    averageRating: number;
    reviewCount: number;
    isEnrolled?: boolean;
    createdAt: string;
}


export interface LecturesResponse {
    content: LectureResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface LecturesApiResponse {
    timestamp: string;
    status: number;
    success: boolean;
    message: string;
    data: LecturesResponse;
    errors: Record<string, string>;
}

// 강의 상태 변경 request 타입 정의

export interface StatusRequest {
    lectureStatus: StatusApiUrl;
}

// 영상 시청 시간 관련 request 타입 정의

export interface UpdateVideoProgressRequest {
    playbackSeconds: number;
}

export interface UpdateVideoProgressByExitRequest {
    playbackSeconds: number;
    lastPositionSec: number;
}

// 영상 시청 시간 관련 response 타입 정의

export interface UpdateVideoProgressResponse {
    chapterId: number;
    watchedSeconds: number;
    progressRate: number;
    isCompleted: boolean;
    totalProgress: number;
    completedCount: number;
}

// 이어보기 response 타입 정의

export interface ResumeResponse {
    lectureId: number;
    chapterId: number;
    chapterTitle: string;
    lastPositionSec: number;
    durationSec: number;
    totalProgress: number;
}

// 메타 데이터 타입 정의

export interface ChapterMeta {
    chapterId: number;
    title: string;
    orderNo: number;
    durationSec: number;
    progressRate: number;
    isCompleted: boolean;
    isAccessible: boolean;
}

export interface LectureMetaResponse {
    lectureId: number;
    lectureTitle: string;
    thumbnailUrl: string | null;

    totalChapterCount: number;

    currentChapterId: number;
    currentChapterNo: number;
    currentChapterTitle: string;

    chapters: ChapterMeta[];
}

// 수강 신청 response 타입 정의

export interface EnrollLectureData {
    enrollmentId: number,
    lectureId: number,
    userId: number,
    totalProgress: number,
    completedCount: number,
    enrolledAt: string
}
export interface EnrollLectureResponse {
    status: number,
    success: boolean,
    message: string,
    data: EnrollLectureData
    errors: {}
}

export interface enrollLectureActionResponse {
    success: boolean,
    message: string
}