import { DashboardSummaryResponse, MonthlyStateResponse } from "@/features/admin/components/dashboard/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

/**
 * 에러핸들링을 진행하는 공통 함수
 * @param response
 * @returns X -> 에러를 던짐
 */
const handleErrorResponse = async (
    response: Response,
    options: { notFoundOn404?: boolean } = { notFoundOn404: true },
) => {
    if (response.status === 404 && options.notFoundOn404) {
        notFound();
    }

    if (!response.ok) {
        const errorText = await response.text();
        let message = response.statusText || "요청 처리에 실패했습니다.";

        if (errorText) {
            try {
                const errorData = JSON.parse(errorText) as { message?: string };
                message = errorData.message ?? message;
            } catch {
                message = errorText;
            }
        }

        throw new Error(
            `${response.status}|${message}`
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
 * 관리자 대시보드 올해 월별 데이터 조회 api
 * @returns MonthlyStateResponse
 */
export const getMonthlyState = async (year?: number): Promise<MonthlyStateResponse> => {
    const params = new URLSearchParams();

    if (year) {
        params.set("year", String(year));
    }

    const queryString = params.toString();
    const response = await fetchWithAuth(`/api/v1/dashboard/monthly-stats${queryString ? `?${queryString}` : ""}`);
    await handleErrorResponse(response);
    const result: ApiResponse<MonthlyStateResponse> = await response.json();
    return assertApiData(result);
};

/**
 * 관리자 대시보드 통계 데이터 조회 api
 * @returns DashboardSummaryResponse
 */
export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {

    const response = await fetchWithAuth('/api/v1/dashboard/summary');
    await handleErrorResponse(response);
    const result: ApiResponse<DashboardSummaryResponse> = await response.json();
    return assertApiData(result);
};
