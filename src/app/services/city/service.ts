import { Building, StreakRequest, StreakResponse } from "@/features/city/type";
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
        cache: "no-store",
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
    const response = await fetchWithAuth(`/api/v1/user/${id}/buildings`);
    await handleErrorResponse(response);
    const result: ApiResponse<Building[]> = await response.json();
    return assertApiData(result);
}

/**
 * 내 도시의 내 잔디 정보 조회 api
 * @param payload 조회를 원하는 연도와 월 
 * @returns StreakResponse
 */
export const getMyStreak = async (payload: StreakRequest): Promise<StreakResponse> => {
    const queryString =
        new URLSearchParams(
            Object.entries(payload)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [
                    key,
                    String(value),
                ])
        ).toString();

    const response = await fetchWithAuth(`/api/v2/streak?${queryString}`);
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
export const getFriendStreak = async (id: string, payload: StreakRequest): Promise<StreakResponse> => {
    const queryString =
        new URLSearchParams(
            Object.entries(payload)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [
                    key,
                    String(value),
                ])
        ).toString();

    const response = await fetchWithAuth(`/api/v2/streak/users/${id}?${queryString}`);
    await handleErrorResponse(response);
    const result: ApiResponse<StreakResponse> = await response.json();
    return assertApiData(result);
}
