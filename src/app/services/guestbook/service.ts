import type { ApiResponse } from "@/lib/api";
import type {
    CreateGuestbookResponse,
    GuestbookListItem,
} from "@/features/guestbook/type";

const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getGuestbooksService = async (
    accessToken: string,
    cityOwnerId?: number
): Promise<ApiResponse<GuestbookListItem[]>> => {
    const queryString =
        cityOwnerId !== undefined ? `?cityOwnerId=${cityOwnerId}` : "";

    const response = await fetch(
        `${BASE_SERVER_URL}/api/v3/friends/guests${queryString}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<GuestbookListItem[]> = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "방명록 목록 불러오기에 실패했습니다."
        );
    }

    return result;
};

export const createGuestbookService = async ({
    ownerId,
    content,
    accessToken,
}: {
    ownerId: number;
    content: string;
    accessToken: string;
}): Promise<ApiResponse<CreateGuestbookResponse>> => {
    const response = await fetch(
        `${BASE_SERVER_URL}/api/v2/friends/guests/register/${ownerId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content }),
        }
    );

    const result: ApiResponse<CreateGuestbookResponse> = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "방명록 작성에 실패했습니다."
        );
    }

    return result;
};
