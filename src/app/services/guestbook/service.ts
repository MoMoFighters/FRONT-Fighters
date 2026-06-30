const BASE_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GuestbookApiResponse<T> {
    success?: boolean;
    status?: number;
    statusCode?: number;
    code?: string;
    message: string;
    data?: T;
    errors?: Record<string, unknown>;
    timestamp?: string;
}

export interface GuestbookListItemResponse {
    bookId: number;
    writerId: number;
    nickname: string;
    content: string;
    createdAt: string;
}

export interface CreateGuestbookResponse {
    bookId: number;
    ownerId: number;
    nickname: string;
    content: string;
    createdAt: string;
}

const parseGuestbookResponse = async <T>(
    response: Response,
    fallbackMessage: string
): Promise<GuestbookApiResponse<T>> => {
    const result = await response.json();

    if (response.status >= 500) {
        throw new Error("500 | 알수없는문제가 발생했습니다.");
    }

    if (!response.ok) {
        return result;
    }

    return result ?? {
        success: false,
        statusCode: response.status,
        message: fallbackMessage,
    };
};

export const getGuestbooksService = async (
    accessToken: string
): Promise<GuestbookApiResponse<GuestbookListItemResponse[]>> => {
    const response = await fetch(`${BASE_SERVER_URL}/api/v2/friends/guests`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return parseGuestbookResponse<GuestbookListItemResponse[]>(
        response,
        "방명록 목록 불러오기에 실패했습니다."
    );
};

export const createGuestbookService = async ({
    ownerId,
    content,
    accessToken,
}: {
    ownerId: number;
    content: string;
    accessToken: string;
}): Promise<GuestbookApiResponse<CreateGuestbookResponse>> => {
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

    return parseGuestbookResponse<CreateGuestbookResponse>(
        response,
        "방명록 작성에 실패했습니다."
    );
};
