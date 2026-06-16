// import { cookies } from 'next/headers';

// /**
// 강의 등록
//  */

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// export interface CreateLectureResponse {
//     timestamp: string;
//     status: number;
//     code: string;
//     message: string;
//     data?: {
//         lectureId: number;
//         teacherId: number;
//         title: string;
//         description: string;
//         thumbnailUrl: string;
//         category: 'STUDY' | 'BEAUTY' | "FITNESS" | 'COOK' | 'ART';
//         lectureStatus: string;
//         completedUserCount: number;
//         createdAt: string;
//         updatedAt: string;
//     }
// }

// export const createLecture = async (
//     formData: FormData,
//     accessToken: string
// ): Promise<CreateLectureResponse> => {

//     let token = accessToken;
//     if (!token) {
//         const cookieStore = await cookies();
//         token = cookieStore.get('accessToken')?.value;
//     }
//     const backendFormData = new FormData();
//     backendFormData.append('title', formData.get('title') as string);
//     backendFormData.append('description', formData.get('description') as string);
//     backendFormData.append('category', formData.get('category') as string);

//     const thumbnailFile = formData.get('thumbnail');
//     if (thumbnailFile) {
//         backendFormData.append('thumbnail', thumbnailFile);
//     }

//     const headers: Record<string, string> = {};
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }


//     const response = await fetch(`${BASE_URL}/api/v1/lectures`, {
//         method: 'POST',
//         headers: headers,
//         body: backendFormData,
//         cache: 'no-store',
//     });


//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`${errorData.status}|${errorData.message}`);
//     }

//     const result = await response.json();
//     return result;
// };


// /**
// 챕터 등록
//  */
// export const createChapter = async (
//     lectureId: number,
//     chapterData: { title: string; orderNo: number; videoFile: File },
//     accessToken: string
// ): Promise<any> => {


//     let token = accessToken;
//     if (!token) {
//         const cookieStore = await cookies();
//         token = cookieStore.get('accessToken')?.value;
//     }

//     // 백엔드 규격에 맞춘 순수 Flat FormData 조립
//     const chapterFormData = new FormData();
//     chapterFormData.append('title', chapterData.title);
//     chapterFormData.append('orderNo', String(chapterData.orderNo));

//     if (chapterData.videoFile && chapterData.videoFile.size > 0) {
//         chapterFormData.append('video', chapterData.videoFile);
//     } else {
//         console.warn(`sc1.2 - [주의] 챕터 ${chapterData.orderNo}번에 첨부된 비디오 파일이 없거나 크기가 0입니다.`);
//     }

//     const headers: Record<string, string> = {};
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

//     // 💡 [수정 내용] 주소 중간에 강사 권한용 '/t'를 정확하게 끼워 넣었습니다.
//     const targetUrl = `${BASE_URL}/api/v1/lectures/${lectureId}/chapters`;


//     const response = await fetch(targetUrl, {
//         method: 'POST',
//         headers: headers,
//         body: chapterFormData,
//         cache: 'no-store',
//     });


//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`${errorData.status}|${errorData.message}`);
//     }

//     const result = await response.json();
//     return result;
// };

export interface CreateLectureData {
    lectureId: number;
    teacherId: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    category: 'STUDY' | 'BEAUTY' | 'FITNESS' | 'COOK' | 'ART';
    lectureStatus: string;
    completedUserCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLectureResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: CreateLectureData;
    errors?: Record<string, unknown>;
}

export const createLecture = async (
    formData: FormData,
    accessToken: string
): Promise<CreateLectureResponse> => {
    try {
        const backendFormData = new FormData();

        backendFormData.append(
            'title',
            formData.get('title') as string
        );

        backendFormData.append(
            'description',
            formData.get('description') as string
        );

        backendFormData.append(
            'category',
            formData.get('category') as string
        );

        const thumbnailFile =
            formData.get('thumbnail');

        if (thumbnailFile) {
            backendFormData.append(
                'thumbnail',
                thumbnailFile
            );
        }

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/lectures`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: backendFormData,
                cache: 'no-store',
            }
        );

        const result: CreateLectureResponse =
            await response.json();

        if (
            response.ok &&
            (result.status === 200 ||
                result.status === 201)
        ) {
            return result;
        }

        if (response.status === 400) {
            throw new Error(
                result.message ||
                '잘못된 요청입니다.'
            );
        }

        if (response.status === 401) {
            throw new Error(
                result.message ||
                '로그인이 필요합니다.'
            );
        }

        if (response.status === 403) {
            throw new Error(
                result.message ||
                '강의 생성 권한이 없습니다.'
            );
        }

        throw new Error(
            result.message ||
            '강의 등록에 실패했습니다.'
        );
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        throw new Error(
            '알 수 없는 오류가 발생했습니다.'
        );
    }
};

export interface CreateChapterResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: {
        chapterId: number;
        lectureId: number;
        title: string;
        orderNo: number;
        videoUrl: string;
    };
    errors?: Record<string, unknown>;
}

// export const createChapter = async (
//     lectureId: number,
//     chapterData: {
//         title: string;
//         orderNo: number;
//         videoFile: File;
//     },
//     accessToken: string
// ): Promise<CreateChapterResponse> => {
//     try {
//         const chapterFormData = new FormData();

//         chapterFormData.append(
//             'title',
//             chapterData.title
//         );

//         chapterFormData.append(
//             'orderNo',
//             String(chapterData.orderNo)
//         );

//         if (
//             chapterData.videoFile &&
//             chapterData.videoFile.size > 0
//         ) {
//             chapterFormData.append(
//                 'video',
//                 chapterData.videoFile
//             );
//         }

//         const response = await fetch(
//             `${BASE_SERVER_URL}/api/v1/lectures/${lectureId}/chapters`,
//             {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 body: chapterFormData,
//                 cache: 'no-store',
//             }
//         );

//         const result: CreateChapterResponse =
//             await response.json();

//         if (
//             response.ok &&
//             (result.status === 200 ||
//                 result.status === 201)
//         ) {
//             return result;
//         }

//         if (response.status === 400) {
//             throw new Error(
//                 result.message ||
//                 '잘못된 요청입니다.'
//             );
//         }

//         if (response.status === 401) {
//             throw new Error(
//                 result.message ||
//                 '로그인이 필요합니다.'
//             );
//         }

//         if (response.status === 403) {
//             throw new Error(
//                 result.message ||
//                 '챕터 생성 권한이 없습니다.'
//             );
//         }

//         if (response.status === 404) {
//             throw new Error(
//                 result.message ||
//                 '강의를 찾을 수 없습니다.'
//             );
//         }

//         throw new Error(
//             result.message ||
//             '챕터 생성에 실패했습니다.'
//         );
//     } catch (error) {
//         if (error instanceof Error) {
//             throw error;
//         }

//         throw new Error(
//             '알 수 없는 오류가 발생했습니다.'
//         );
//     }
// };



/**
 * 1. 챕터 생성 API (POST)
 * 이제 비디오 파일을 여기서 쏘지 않고 순수하게 챕터 기본 정보만 생성합니다.
 */
export const createChapter = async (
    lectureId: number,
    chapterData: { title: string; orderNo: number },
    accessToken: string
): Promise<CreateChapterResponse> => {
    try {
        const chapterFormData = new FormData();
        chapterFormData.append('title', chapterData.title);
        chapterFormData.append('orderNo', String(chapterData.orderNo));

        const response = await fetch(
            `${BASE_SERVER_URL}/api/v1/lectures/${lectureId}/chapters`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: chapterFormData,
                cache: 'no-store',
            }
        );

        const result: CreateChapterResponse = await response.json();

        if (response.ok && (result.status === 200 || result.status === 201)) {
            return result;
        }

        throw new Error(result.message || '챕터 생성에 실패했습니다.');
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('알 수 없는 오류가 발생했습니다.');
    }
};


/**
 * 2. 💡 [NEW] 챕터 동영상 등록 API (PATCH)
 * 요구하신 백엔드 스펙 `PATCH /api/v1/lectures/{lectureId}/chapters/{chapterId}/video`에 정확히 맞춘 전송 함수입니다.
 */

export const uploadChapterVideo = async (
    lectureId: number,
    chapterId: number,
    videoFile: File,
    durationSec: number,
    accessToken: string
) => {

    const formData =
        new FormData();

    formData.append(
        'video',
        videoFile
    );

    formData.append(
        'durationSec',
        String(durationSec)
    );

    const response =
        await fetch(
            `${BASE_SERVER_URL}/api/v1/lectures/${lectureId}/chapters/${chapterId}/video`,
            {
                method: 'PATCH',
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
                body: formData,
                cache: 'no-store',
            }
        );

    const result =
        await response.json();

    if (!response.ok) {
        throw new Error(
            `${result.status}|${result.message}`
        );
    }

    return result;
};
