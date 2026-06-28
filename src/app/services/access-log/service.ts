import { AccessLogResponse } from "@/features/admin/access-log/type";
import { ApiResponse, fetchWithAuth } from "@/lib/api";
import { notFound } from "next/navigation";

/**
 * 접근 로그 전체 조회 api
 * @returns AccessLogResponse
 */
export const getAccessLogs = async (page: number): Promise<AccessLogResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    const response = await fetchWithAuth(`/api/v1/logs/access?${params.toString()}`);

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            `${errorData.status}|${errorData.message}`
        );
    }

    const result: ApiResponse<AccessLogResponse> = await response.json();

    if (!result.data) {
        throw new Error(result.message);
    }
    return result.data;

}