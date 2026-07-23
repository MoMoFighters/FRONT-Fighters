import { Building, Fortune, StreakResponse } from "@/features/city/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

/**
 * 에러핸들링을 진행하는 공통 함수
 * @param response
 * @returns X -> 에러를 던짐
 */
const handleErrorResponse = async (response: Response) => {
    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        const errorData: { status?: number; statusCode?: number; message?: string } =
            await response.json();

        throw new Error(
            `${errorData.statusCode ?? errorData.status}|${errorData.message}`
        );
    }
};

/**
 * 에러가 나지 않았을 때 돌려주는 응답값을 정의하는 공통 함수
 * @param result 
 * @returns result.data
 */
const assertApiData = <T>(result: ApiResponse<T>): T => {
    if (!result.data) {
        throw new Error(result.message);
    }

    return result.data;
};

/**
 * 내 도시의 내 건물 정보 조회 api
 * @returns Building[]
 */
export const getMyBuildings = async () => {
    const response = await fetchWithAuth("/api/v1/user/buildings", {
        next: {
            revalidate: false,
        },
    });
    await handleErrorResponse(response);
    const result: ApiResponse<Building[]> = await response.json();
    return assertApiData(result);
}

/**
 * 친구 도시의 내 건물 정보 조회 api
 * @returns Building[]
 */
export const getFriendBuildings = async (id: string) => {
    const response = await fetchWithAuth(`/api/v1/user/${id}/buildings`, {
        next: { revalidate: 60 },
    });
    await handleErrorResponse(response);
    const result: ApiResponse<Building[]> = await response.json();
    return assertApiData(result);
}

/**
 * 내 도시의 내 잔디 정보 조회 api
 * @returns StreakResponse
 */
export const getMyStreak = async (): Promise<StreakResponse> => {
    const response = await fetchWithAuth("/api/v2/streak", {
        next: {
            revalidate: 60,
        },
    });
    await handleErrorResponse(response);
    const result: ApiResponse<StreakResponse> = await response.json();
    return assertApiData(result);
}

/**
 * 내 도시의 연간 잔디 정보 조회 api (잔디 히트맵용)
 * @returns StreakResponse
 */
export const getMyYearlyStreak = async (): Promise<StreakResponse> => {
    const response = await fetchWithAuth("/api/v2/streak/yearly", {
        next: {
            revalidate: 300,
        },
    });
    await handleErrorResponse(response);
    const result: ApiResponse<StreakResponse> = await response.json();
    return assertApiData(result);
}

/**
 * 친구 도시의 친구 잔디 정보 조회 api
 * @param id 조회할 친구 id
 * @param payload 조회할 잔디 연/월
 * @returns StreakResponse
 */
export const getFriendStreak = async (id: string): Promise<StreakResponse> => {
    const response = await fetchWithAuth(`/api/v2/streak/users/${id}`, {
        next: {
            revalidate: 60,
        },
    });
    await handleErrorResponse(response);
    const result: ApiResponse<StreakResponse> = await response.json();
    return assertApiData(result);
}

/**
 * 오늘의 운세 뽑기 api (포인트 차감)
 * @returns Fortune
 */
export const getFortune = async (): Promise<Fortune> => {
    const response = await fetchWithAuth("/api/v1/city/fortune", {
        method: "POST",
    });
    await handleErrorResponse(response);
    const result: ApiResponse<Fortune> = await response.json();
    return assertApiData(result);
}
