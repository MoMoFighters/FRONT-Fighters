"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const getLectureCreateAccessTokenAction = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        throw new Error("로그인이 필요합니다.");
    }

    return accessToken;
};

export const revalidateTeacherLectureCreateAction = async (
    lectureId?: number
) => {
    revalidatePath("/teacher/lectures");

    if (lectureId) {
        revalidatePath(`/teacher/lectures/${lectureId}`);
    }
};
