"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ApiResponse } from "@/lib/api";
import {
    createGuestbookService,
    getGuestbooksService,
} from "@/app/services/guestbook/service";
import type {
    CreateGuestbookResponse,
    GuestbookListItem,
} from "@/features/guestbook/type";

const getAccessToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
};

const createErrorResponse = <T>(
    error: unknown,
    message: string
): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: error instanceof Error ? error.message : message,
});

const createUnauthorizedResponse = <T>(): ApiResponse<T> => ({
    timestamp: new Date().toISOString(),
    status: 401,
    code: "UNAUTHORIZED",
    message: "로그인이 필요합니다.",
});

export const getGuestbooksAction = async (
    cityOwnerId?: number
): Promise<ApiResponse<GuestbookListItem[]>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<GuestbookListItem[]>();
        }

        return await getGuestbooksService(accessToken, cityOwnerId);
    } catch (error) {
        return createErrorResponse<GuestbookListItem[]>(
            error,
            "방명록 목록 불러오기에 실패했습니다."
        );
    }
};

export const createGuestbookAction = async ({
    ownerId,
    content,
}: {
    ownerId: number;
    content: string;
}): Promise<ApiResponse<CreateGuestbookResponse>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<CreateGuestbookResponse>();
        }

        const result = await createGuestbookService({
            ownerId,
            content,
            accessToken,
        });

        // 방명록 작성도 포인트를 지급하는 액션이라, 마이페이지 포인트 내역이 바로 반영되게 무효화한다.
        revalidatePath("/student/mypage");
        revalidatePath("/student/mypage/point");

        return result;
    } catch (error) {
        return createErrorResponse<CreateGuestbookResponse>(
            error,
            "방명록 작성에 실패했습니다."
        );
    }
};
