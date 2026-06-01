'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import {
    createLecture,
    createChapter,
    uploadChapterVideo,
} from './lectureCreateService';

export interface CreateLectureActionResponse {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    data?: unknown;
    errors?: Record<string, unknown>;
}

export const createLectureWithChaptersAction = async (
    prevState: CreateLectureActionResponse,
    formData: FormData
): Promise<CreateLectureActionResponse> => {

    try {

        const cookieStore =
            await cookies();

        const accessToken =
            cookieStore
                .get('accessToken')
                ?.value;

        if (!accessToken) {
            return {
                timestamp:
                    new Date().toISOString(),
                status: 401,
                code: 'UNAUTHORIZED',
                message: '로그인이 필요합니다.',
                errors: {},
            };
        }

        const chapterCount = Number(
            formData.get('chapterCount') ?? 0
        );

        const savedChapters: Array<{
            title: string;
            orderNo: number;
            durationSec: number;
            videoFile: File;
        }> = [];

        for (
            let i = 1;
            i <= chapterCount;
            i++
        ) {

            const title =
                formData.get(
                    `chapterTitle_${i}`
                ) as string;

            const videoFile =
                formData.get(
                    `video_${i}`
                ) as File;

            const durationSec =
                Number(
                    formData.get(
                        `durationSec_${i}`
                    ) ?? 0
                );

            if (title?.trim()) {

                savedChapters.push({
                    title,
                    orderNo: i,
                    durationSec,
                    videoFile,
                });
            }
        }

        /**
         * STEP 1
         * 강의 생성
         */
        const lectureResult =
            await createLecture(
                formData,
                accessToken
            );

        const lectureId =
            lectureResult.data?.lectureId;

        if (!lectureId) {
            return {
                timestamp:
                    new Date().toISOString(),
                status: 500,
                code: 'FAIL',
                message:
                    '강의 생성 후 lectureId를 찾을 수 없습니다.',
                errors: {},
            };
        }

        /**
         * STEP 2
         * 챕터 생성
         * -> chapterId 획득
         * -> 영상 등록
         */
        for (const chapter of savedChapters) {

            const chapterResult =
                await createChapter(
                    lectureId,
                    {
                        title:
                            chapter.title,

                        orderNo:
                            chapter.orderNo,
                    },
                    accessToken
                );

            const chapterId =
                chapterResult.data?.chapterId;

            if (!chapterId) {
                throw new Error(
                    '챕터 생성 후 chapterId를 찾을 수 없습니다.'
                );
            }

            if (
                chapter.videoFile &&
                chapter.videoFile.size > 0
            ) {

                await uploadChapterVideo(
                    lectureId,
                    chapterId,
                    chapter.videoFile,
                    chapter.durationSec,
                    accessToken
                );
            }
        }

        revalidatePath(
            '/teacher/lecture'
        );

        return lectureResult;

    } catch (error) {

        return {
            timestamp:
                new Date().toISOString(),
            status: 500,
            code: 'FAIL',
            message:
                error instanceof Error
                    ? error.message
                    : '강의 등록에 실패했습니다.',
            errors: {},
        };
    }
};