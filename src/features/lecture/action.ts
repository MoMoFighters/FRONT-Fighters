'use server'

import { enrollLectureById, updateLectureStatus, updateVideoProgress, updateVideoProgressByExit } from "@/app/services/lecture/service";
import { enrollLectureActionResponse, StatusApiUrl, StatusRequest, UpdateVideoProgressByExitRequest, UpdateVideoProgressRequest } from "./type";
import { revalidatePath } from "next/cache";


// 상태 업데이트 액션함수
export const updateLectureStatusAction = async (id: string, status: StatusApiUrl) => {
    const payload: StatusRequest = { lectureStatus: status };
    await updateLectureStatus(id, payload);
    revalidatePath('/admin/lectures');
}

export const updateVideoProgressAction = async (
    lectureId: string,
    chapterId: string,
    payload: UpdateVideoProgressRequest
) => {

    return await updateVideoProgress(
        lectureId,
        chapterId,
        payload
    );
};

export const updateVideoProgressByExitAction = async (
    lectureId: string,
    chapterId: string,
    payload: UpdateVideoProgressByExitRequest
) => {

    return await updateVideoProgressByExit(
        lectureId,
        chapterId,
        payload
    );
};

export const enrollLectureAction = async (lectureId: string) => {
    await enrollLectureById(lectureId);
    revalidatePath('/student/lectures');
    revalidatePath('/student/study/lectures');
    revalidatePath('/student/fitness/lectures');
    revalidatePath('/student/cook/lectures');
    revalidatePath('/student/beauty/lectures');
    revalidatePath('/student/art/lectures');
}