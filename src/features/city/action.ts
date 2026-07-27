"use server";

import { revalidatePath } from "next/cache";
import {
    getFriendStreak,
    getMyBuildings,
    getMyStreak,
    getMyYearlyStreak,
    getFortune,
} from "@/app/services/city/service";
import { Building, Fortune, StreakResponse } from "./type";

export type StreakActionResult = {
    success: boolean;
    message?: string;
    data?: StreakResponse;
};

export type BuildingActionResult = {
    success: boolean;
    message?: string;
    data?: Building[];
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
): Promise<StreakActionResult> => {
    try {
        const data = await getMyStreak();

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

export const getMyBuildingsAction = async (): Promise<BuildingActionResult> => {
    try {
        const data = await getMyBuildings();

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

export const getMyYearlyStreakAction = async (
): Promise<StreakActionResult> => {
    try {
        const data = await getMyYearlyStreak();

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
): Promise<StreakActionResult> => {
    try {
        const data = await getFriendStreak(userId);

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

export type FortuneActionResult = {
    success: boolean;
    message?: string;
    data?: Fortune;
};

export const getFortuneAction = async (): Promise<FortuneActionResult> => {
    try {
        const data = await getFortune();

        // 운세 보기도 포인트를 소모하는 액션이라, 마이페이지 포인트 내역이 바로 반영되게 무효화한다.
        revalidatePath("/student/mypage");
        revalidatePath("/student/mypage/point");

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
