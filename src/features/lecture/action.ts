'use server'

import { updateLectureStatus } from "@/app/services/lecture/service";
import { StatusApiUrl, StatusRequest } from "./type";
import { revalidatePath } from "next/cache";


// 상태 업데이트 액션함수
export const updateLectureStatusAction = async (id: string, status: StatusApiUrl) => {
    const payload: StatusRequest = { lectureStatus: status };
    await updateLectureStatus(id, payload);
    revalidatePath('/admin/lectures');
}