"use server";

import { cookies } from "next/headers";
import {
    createGuestbookService,
    getGuestbooksService,
    type CreateGuestbookResponse,
    type GuestbookApiResponse,
    type GuestbookListItemResponse,
} from "@/app/services/guestbook/service";

const createUnauthorizedResponse = <T>(): GuestbookApiResponse<T> => ({
    success: false,
    statusCode: 401,
    message: "다시 로그인 해주세요.",
    data: undefined,
    errors: {},
});

const createErrorResponse = <T>(
    error: unknown,
    fallbackMessage: string
): GuestbookApiResponse<T> => ({
    success: false,
    statusCode: 500,
    message: error instanceof Error ? error.message : fallbackMessage,
    data: undefined,
    errors: {},
});

const getAccessToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
};

export const getGuestbooksAction = async (): Promise<
    GuestbookApiResponse<GuestbookListItemResponse[]>
> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<GuestbookListItemResponse[]>();
        }

        return await getGuestbooksService(accessToken);
    } catch (error) {
        return createErrorResponse<GuestbookListItemResponse[]>(
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
}): Promise<GuestbookApiResponse<CreateGuestbookResponse>> => {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return createUnauthorizedResponse<CreateGuestbookResponse>();
        }

        return await createGuestbookService({
            ownerId,
            content,
            accessToken,
        });
    } catch (error) {
        return createErrorResponse<CreateGuestbookResponse>(
            error,
            "방명록 작성에 실패했습니다."
        );
    }
};
