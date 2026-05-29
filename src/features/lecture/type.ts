// 실제로 화면에서 필요한 강의의 타입 정의


export interface Lecture {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: string;
    lectureStatus: string;
    averageRating: number;
}

// 강의 목록 조회에서 필요한 props 타입 정의

export interface GetLecturesRequest {
    category?: string;
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
    category: string;
    lectureStatus: string;
    averageRating: number;
    reviewCount: number;
    isEnrolled?: boolean;
    createdAt: string;
}

export interface LectureListInfo {
    content: Lecture[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
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



