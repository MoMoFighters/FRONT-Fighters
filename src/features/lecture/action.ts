'use server'

import {
    createReviewByLectureId,
    deleteChapterVideoById,
    deleteLectureById,
    deleteReviewById,
    enrollLectureById,
    updateChapterByIds,
    updateLectureById,
    updateLectureStatus,
    updateVideoProgress,
    updateVideoProgressByExit,
} from "@/app/services/lecture/service";
import {
    CreateReviewRequest,
    LectureStatus,
    UpdateChapterRequest,
    UpdateLectureRequest,
    UpdateLectureResponse,
    UpdateVideoProgressByExitRequest,
    UpdateVideoProgressRequest,
} from "./type";
import { revalidatePath, revalidateTag } from "next/cache";


// 강의 상태 업데이트 액션함수
export const updateLectureStatusAction = async (id: string, status: LectureStatus) => {
    await updateLectureStatus(id, status);
    revalidatePath('/admin/lectures');
    revalidatePath('/teacher/lectures');
    revalidatePath('/student/lectures');
    revalidatePath('/student/study/lectures');
    revalidatePath('/student/fitness/lectures');
    revalidatePath('/student/art/lectures');
    revalidatePath('/student/cook/lectures');
    revalidatePath('/student/beauty/lectures');
    revalidatePath('/lectures');
    revalidatePath(`/lectures/${id}`);
    revalidatePath(`/admin/lectures/${id}`);
    revalidateTag("lectures", { expire: 0 });
}

// 영상 시청 중 진척도 저장하는 액션함수
export const updateVideoProgressAction = async (
    lectureId: string,
    chapterId: string,
    payload: UpdateVideoProgressRequest
) => {

    const result = await updateVideoProgress(
        lectureId,
        chapterId,
        payload
    );

    revalidateLectureProgressPaths(lectureId, chapterId);

    return result;
};

// 나가기 버튼 클릭 시 진척도 저장하는 액션함수
export const updateVideoProgressByExitAction = async (
    lectureId: string,
    chapterId: string,
    payload: UpdateVideoProgressByExitRequest
) => {

    const result = await updateVideoProgressByExit(
        lectureId,
        chapterId,
        payload
    );

    revalidateLectureProgressPaths(lectureId, chapterId);

    return result;
};

const revalidateLectureProgressPaths = (
    lectureId: string,
    chapterId: string
) => {
    revalidatePath('/student');

    revalidatePath(`/student/lectures/${lectureId}`);
    revalidatePath(`/student/mypage/lectures`);
    revalidatePath(`/student/mypage/lectures/${lectureId}`);
    revalidatePath(`/student/mypage/lectures/${lectureId}/chapters/${chapterId}`);

    revalidatePath(`/student/study/lectures/${lectureId}`);
    revalidatePath(`/student/study/lectures/${lectureId}/chapters/${chapterId}`);
    revalidatePath(`/student/fitness/lectures/${lectureId}`);
    revalidatePath(`/student/fitness/lectures/${lectureId}/chapters/${chapterId}`);
    revalidatePath(`/student/cook/lectures/${lectureId}`);
    revalidatePath(`/student/cook/lectures/${lectureId}/chapters/${chapterId}`);
    revalidatePath(`/student/beauty/lectures/${lectureId}`);
    revalidatePath(`/student/beauty/lectures/${lectureId}/chapters/${chapterId}`);
    revalidatePath(`/student/art/lectures/${lectureId}`);
    revalidatePath(`/student/art/lectures/${lectureId}/chapters/${chapterId}`);
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
export const createReviewAction = async (
    lectureId: string,
    payload: CreateReviewRequest
) => {
    await createReviewByLectureId(lectureId, payload);
    revalidatePath(`/student/lectures/${lectureId}`);
    revalidatePath(`/student/study/lectures/${lectureId}`);
    revalidatePath(`/student/fitness/lectures/${lectureId}`);
    revalidatePath(`/student/cook/lectures/${lectureId}`);
    revalidatePath(`/student/beauty/lectures/${lectureId}`);
    revalidatePath(`/student/art/lectures/${lectureId}`);
    revalidatePath(`/student/mypage/lectures/${lectureId}`);
    revalidatePath(`/admin/lectures/${lectureId}`);
    revalidatePath(`/teacher/lectures/${lectureId}`);
    revalidatePath('/lectures');
    revalidatePath(`/lectures/${lectureId}`);
    revalidateTag("lectures", { expire: 0 });
}

export type LectureDeleteActionResult = {
    success: boolean;
    message?: string;
};

const getLectureActionErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        const [status, message] = error.message.split("|");

        if (/^\d+$/.test(status) && message) {
            return message;
        }

        return error.message;
    }

    return "요청 처리 중 오류가 발생했습니다.";
};

export type LectureUpdateActionResult = {
    success: boolean;
    message?: string;
    data?: UpdateLectureResponse;
};

export const updateLectureAction = async (
    lectureId: string,
    payload: UpdateLectureRequest,
): Promise<LectureUpdateActionResult> => {
    try {
        const data = await updateLectureById(lectureId, payload);
        revalidatePath("/admin/lectures");
        revalidatePath("/teacher/lectures");
        revalidatePath("/lectures");
        revalidatePath(`/lectures/${lectureId}`);
        revalidatePath(`/admin/lectures/${lectureId}`);
        revalidatePath(`/teacher/lectures/${lectureId}`);
        revalidatePath(`/teacher/lectures/${lectureId}/edit`);
        revalidateTag("lectures", { expire: 0 });

        return {
            success: true,
            message: "강의를 수정했습니다.",
            data: data ?? undefined,
        };
    } catch (error) {
        return {
            success: false,
            message: getLectureActionErrorMessage(error),
        };
    }
};

export const updateChapterAction = async (
    lectureId: string,
    chapterId: string,
    payload: UpdateChapterRequest,
): Promise<LectureDeleteActionResult> => {
    try {
        await updateChapterByIds(lectureId, chapterId, payload);
        revalidatePath("/admin/lectures");
        revalidatePath(`/admin/lectures/${lectureId}`);
        revalidatePath(`/admin/lectures/${lectureId}/chapters/${chapterId}`);
        revalidatePath("/teacher/lectures");
        revalidatePath(`/teacher/lectures/${lectureId}`);
        revalidatePath(`/teacher/lectures/${lectureId}/edit`);
        revalidateTag("lectures", { expire: 0 });

        return {
            success: true,
            message: "챕터를 수정했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getLectureActionErrorMessage(error),
        };
    }
};

export const deleteLectureAction = async (
    lectureId: string,
): Promise<LectureDeleteActionResult> => {
    try {
        await deleteLectureById(lectureId);
        revalidatePath("/admin/lectures");
        revalidatePath("/lectures");
        revalidatePath(`/lectures/${lectureId}`);
        revalidatePath(`/admin/lectures/${lectureId}`);
        revalidateTag("lectures", { expire: 0 });

        return {
            success: true,
            message: "강의를 삭제했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getLectureActionErrorMessage(error),
        };
    }
};

export const deleteChapterAction = async (
    lectureId: string,
    chapterId: string,
): Promise<LectureDeleteActionResult> => {
    try {
        // 챕터 동영상 삭제 api가 성공하면 백엔드에서 챕터 자체도 함께 삭제된다.
        await deleteChapterVideoById(lectureId, chapterId);
        revalidatePath("/admin/lectures");
        revalidatePath(`/admin/lectures/${lectureId}`);
        revalidatePath(`/admin/lectures/${lectureId}/chapters/${chapterId}`);
        revalidatePath("/teacher/lectures");
        revalidatePath(`/teacher/lectures/${lectureId}`);
        revalidatePath(`/teacher/lectures/${lectureId}/edit`);
        revalidatePath("/lectures");
        revalidatePath(`/lectures/${lectureId}`);
        revalidateTag("lectures", { expire: 0 });

        return {
            success: true,
            // 백엔드 응답 메시지("챕터 동영상이 삭제되었습니다")는 영상만 지워진 것으로
            // 오해할 수 있어, 챕터 전체가 삭제됐음을 명확히 알리는 문구로 대체한다.
            message: "챕터가 삭제되었습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getLectureActionErrorMessage(error),
        };
    }
};

export const deleteReviewAction = async (
    lectureId: string,
    reviewId: string,
): Promise<LectureDeleteActionResult> => {
    try {
        await deleteReviewById(reviewId);
        revalidatePath("/admin/lectures");
        revalidatePath("/lectures");
        revalidatePath(`/lectures/${lectureId}`);
        revalidatePath(`/admin/lectures/${lectureId}`);
        revalidateTag("lectures", { expire: 0 });

        return {
            success: true,
            message: "수강평을 삭제했습니다.",
        };
    } catch (error) {
        return {
            success: false,
            message: getLectureActionErrorMessage(error),
        };
    }
};
