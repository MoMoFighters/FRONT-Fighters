'use server'

import { updateLectureStatus, updateVideoProgress, updateVideoProgressByExit } from "@/app/services/lecture/service";
import { StatusApiUrl, StatusRequest, UpdateVideoProgressByExitRequest, UpdateVideoProgressRequest } from "./type";
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