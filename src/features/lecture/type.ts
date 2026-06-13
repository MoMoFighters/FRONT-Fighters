export type LectureCategory =
    "STUDY" | "FITNESS" | "COOK" | "BEAUTY" | "ART";

export type LectureStatus =
    "WAITING" | "ACTIVE" | "HOLD" | "DELETE";

export type VideoStatus =
    "UPLOADING" | 'ENCODING' | 'READY' | 'FAILED';

// 실제로 화면에서 필요한 강의의 타입 정의

export interface Lecture {
    lectureId: number;

    teacherId?: number;
    teacherName?: string;

    title: string;
    description: string;
    thumbnailUrl: string;
    category: LectureCategory;
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
    category: LectureCategory;
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
    category: LectureCategory;
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

// 🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑
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


// // 강의의 총 진척도 필요없으면 지우셈 필요없으면 지우셈 필요없으면 지우셈 필요없으면 지우셈 필요없으면 지우셈 
// export interface LectureProgress {
//     totalProgress: number;
//     completedCount: number;
//     totalChapterCount: number;
// }



// 🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑
export interface LectureListResponse {
    content: Lecture[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;

    // 🍑🍑🍑카테고리별 total progress 추가🍑🍑🍑🍑🍑🍑
    // 🍑🍑🍑마지막으로 본 강의 정보 추가🍑🍑🍑🍑🍑🍑
}


// 강의 목록 조회에서 필요한 props 타입 정의 🍑request->payload로 이름변경
export interface GetLecturesPayload {
    category?: LectureCategory;
    keyword?: string;
    status?: string;
    enrolled?: boolean;
    page?: number;
}




//🍑🍑🍑🍑🍑🍑🍑🍑🍑
//🍑🍑🍑 export interface StatusRequest {
//     lectureStatus: LectureStatus;
// }

// 영상 시청 시간 관련 request 타입 정의

// export interface UpdateVideoProgressRequest {
//     playbackSeconds: number;
// }






// 홍근티비가 상의 후 변경할수도있음!!!!!!!

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








// 🍑🍑🍑🍑메타 데이터 타입 정의🍑🍑🍑🍑

// export interface ChapterMeta {
//     chapterId: number;
//     title: string;
//     orderNo: number;
//     durationSec: number;
//     progressRate: number;
//     isCompleted: boolean;
//     isAccessible: boolean;
// }

// export interface LectureMetaResponse {
//     lectureId: number;
//     lectureTitle: string;
//     thumbnailUrl: string | null;

//     totalChapterCount: number;

//     currentChapterId: number;
//     currentChapterNo: number;
//     currentChapterTitle: string;

//     chapters: ChapterMeta[];
// }









// 🍑🍑🍑🍑이건 없애는 방향으로 추진🍑🍑🍑🍑
// 🍑🍑🍑🍑수강 신청 response 타입 정의🍑🍑🍑🍑

// export interface LectureEnrollResponse {
//     enrollmentId: number,
//     lectureId: number,
//     userId: number,
//     totalProgress: number,
//     completedCount: number,
//     enrolledAt: string
// }
// export interface EnrollLectureResponse {
//     status: number,
//     success: boolean,
//     message: string,
//     data: LectureEnrollResponse
//     errors: {}
// }





//🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑
//등록 관련
//🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑

export interface 다시정의하세요 {

}