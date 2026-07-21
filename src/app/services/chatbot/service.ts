import { ApiResponse } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ChatbotUsageResponse {
    callCount: number;
    dailyLimit: number;
    usagePercentage: number;
}

export const getChatbotUsageService = async (
    accessToken: string
): Promise<ChatbotUsageResponse> => {
    const response = await fetch(`${BASE_URL}/api/v1/chatbot/usage`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`${response.status}|챗봇 사용량 조회에 실패했습니다.`);
    }

    const result: ApiResponse<ChatbotUsageResponse> = await response.json();

    if (!result.data) {
        throw new Error(result.message);
    }

    return result.data;
};
