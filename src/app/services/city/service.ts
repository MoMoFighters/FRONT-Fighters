import { Building } from "@/features/city/type";
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
        const errorData = await response.json();

        throw new Error(
            `${errorData.status}|${errorData.message}`
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
    const response = await fetchWithAuth("api/v1/user/buildings");
    await handleErrorResponse(response);
    const result: ApiResponse<Building[]> = await response.json();
    return assertApiData(result);
}

/**
 * 친구 도시의 내 건물 정보 조회 api
 * @returns Building[]
 */
export const getFriendBuildings = async (id: string) => {
    const response = await fetchWithAuth(`api/v1/user/${id}/buildings`);
    await handleErrorResponse(response);
    const result: ApiResponse<Building[]> = await response.json();
    return assertApiData(result);
}