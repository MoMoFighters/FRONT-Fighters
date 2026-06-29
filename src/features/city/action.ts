"use server";

import { getFriendStreak, getMyStreak } from "@/app/services/city/service";
import { StreakRequest, StreakResponse } from "./type";

export type StreakActionResult = {
    success: boolean;
    message?: string;
    data?: StreakResponse;
};

const getCityActionErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        const [status, message] = error.message.split("|");

        if (/^\d+$/.test(status) && message) {
            return message;
        }

        return error.message;
    }

    return "잔디 정보를 불러오지 못했습니다.";
};

export const getMyStreakAction = async (
    payload: StreakRequest,
): Promise<StreakActionResult> => {
    try {
        const data = await getMyStreak(payload);

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: getCityActionErrorMessage(error),
        };
    }
};

export const getFriendStreakAction = async (
    userId: string,
    payload: StreakRequest,
): Promise<StreakActionResult> => {
    try {
        const data = await getFriendStreak(userId, payload);

        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            message: getCityActionErrorMessage(error),
        };
    }
};
