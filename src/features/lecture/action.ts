'use server'

import { enrollLectureById, enrollReviewByLectureId, updateLectureStatus, updateVideoProgress, updateVideoProgressByExit } from "@/app/services/lecture/service";
import { EnrollReviewRequest, LectureStatus, UpdateVideoProgressByExitRequest, UpdateVideoProgressRequest } from "./type";
import { revalidatePath } from "next/cache";


// 강의 상태 업데이트 액션함수
export const updateLectureStatusAction = async (id: string, status: LectureStatus) => {
    await updateLectureStatus(id, status);
    revalidatePath('/admin/lectures');
}

// 영상 시청 중 진척도 저장하는 액션함수
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

// 나가기 버튼 클릭 시 진척도 저장하는 액션함수
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

// 수강 신청 액션 함수
export const enrollLectureAction = async (lectureId: string, position?: string) => {
    await enrollLectureById(lectureId, position);
    revalidatePath('/student/lectures');
    revalidatePath('/student/study/lectures');
    revalidatePath('/student/fitness/lectures');
    revalidatePath('/student/cook/lectures');
    revalidatePath('/student/beauty/lectures');
    revalidatePath('/student/art/lectures');
}

// 수강평 등록 액션 함수
export const enrollReviewAction = async (lectureId: string, payload: EnrollReviewRequest) => {
    await enrollReviewByLectureId(lectureId, payload);
    revalidatePath(`/student/lectures/${lectureId}`);
    revalidatePath(`/student/study/lectures/${lectureId}`);
    revalidatePath(`/student/fitness/lectures/${lectureId}`);
    revalidatePath(`/student/cook/lectures/${lectureId}`);
    revalidatePath(`/student/beauty/lectures/${lectureId}`);
    revalidatePath(`/student/art/lectures/${lectureId}`);
    revalidatePath(`/admin/lectures/${lectureId}`);
    revalidatePath(`/teacher/lectures/${lectureId}`);
}
