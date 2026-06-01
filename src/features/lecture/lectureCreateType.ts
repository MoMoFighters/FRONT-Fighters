export interface Chapter {
    chapterId: number;
    lectureId: number;
    title: string;
    orderNo: number;
    videoUrl: string | null;
    videoSizeBytes: number | null;
    durationSec: number | null;
    videoStatus: string;
    originalFilename: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ChapterForm {
    title: string;
    orderNo: number;
}

export interface BaseResponse<T> {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: T;
}

export type CreateLectureActionResponse = BaseResponse<Lecture>;

export interface Lecture {
    lectureId: number; // ← 이 필드가 정확히 소문자 l로 시작하는지, 스펠링이 맞는지 확인!
    teacherId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: 'STUDY' | 'BEAUTY' | "FITNESS" | 'COOK' | 'ART';
    lectureStatus: string;
    completedUserCount: number;
    createdAt: string;
    updatedAt: string;
}
