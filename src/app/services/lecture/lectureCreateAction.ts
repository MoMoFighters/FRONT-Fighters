'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import {
    createLecture,
    createChapter,
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
        const cookieStore = await cookies();

        const accessToken =
            cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return {
                timestamp: new Date().toISOString(),
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
            videoFile: File;
            orderNo: number;
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

            if (title?.trim()) {
                savedChapters.push({
                    title,
                    videoFile,
                    orderNo: i,
                });
            }
        }

        const lectureResult =
            await createLecture(
                formData,
                accessToken
            );

        const lectureId =
            lectureResult.data?.lectureId;

        if (!lectureId) {
            return {
                timestamp: new Date().toISOString(),
                status: 500,
                code: 'FAIL',
                message: '강의 ID를 확인할 수 없습니다.',
                errors: {},
            };
        }

        for (const chapter of savedChapters) {
            await createChapter(
                lectureId,
                {
                    title: chapter.title,
                    orderNo: chapter.orderNo,
                    videoFile:
                        chapter.videoFile,
                },
                accessToken
            );
        }

        revalidatePath('/teacher/lecture');

        return lectureResult;
    } catch (error) {
        return {
            timestamp: new Date().toISOString(),
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